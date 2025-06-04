import db from '../config/firebase.js';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileRef = db.ref(`users/${userId}/profile`);
    const snapshot = await profileRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
    }
    res.status(200).json({ message: 'Profil berhasil diambil', data: snapshot.val() });
  } catch (error) {
    console.error("Error di getUserProfile:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
        namaLengkap, 
        email, 
        nomorWhatsAppNotifikasi, 
        namaToko,
        preferensiNotifikasiEmail,
        preferensiNotifikasiWhatsApp 
    } = req.body;

    if (!namaLengkap || !email || !nomorWhatsAppNotifikasi) {
      return res.status(400).json({ message: 'Nama Lengkap, Email, dan Nomor WhatsApp tidak boleh kosong.' });
    }

    const profileRef = db.ref(`users/${userId}/profile`);
    
    const profileDataToUpdate = {
      namaLengkap,
      email,
      nomorWhatsAppNotifikasi,
      namaToko: namaToko || ''
    };

    if (typeof preferensiNotifikasiEmail === 'boolean') {
        profileDataToUpdate.preferensiNotifikasiEmail = preferensiNotifikasiEmail;
    }
    if (typeof preferensiNotifikasiWhatsApp === 'boolean') {
        profileDataToUpdate.preferensiNotifikasiWhatsApp = preferensiNotifikasiWhatsApp;
    }

    await profileRef.update(profileDataToUpdate);
    
    const updatedSnapshot = await profileRef.once('value');
    res.status(200).json({ message: 'Profil berhasil diperbarui', data: updatedSnapshot.val() });
  } catch (error) {
    console.error("Error di updateUserProfile:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { passwordLama, passwordBaru, konfirmasiPasswordBaru } = req.body;

        if (!passwordLama || !passwordBaru || !konfirmasiPasswordBaru) {
            return res.status(400).json({ message: 'Semua field password wajib diisi.' });
        }
        if (passwordBaru !== konfirmasiPasswordBaru) {
            return res.status(400).json({ message: 'Password baru dan konfirmasi password tidak cocok.' });
        }
        if (passwordBaru.length < 6) {
            return res.status(400).json({ message: 'Password baru minimal harus 6 karakter.' });
        }

        const userCredentialsRef = db.ref(`users/${userId}/credentials`);
        const snapshot = await userCredentialsRef.once('value');
        const credentials = snapshot.val();

        if (!credentials || !credentials.password) {
            return res.status(404).json({ message: 'Data kredensial pengguna tidak ditemukan.' });
        }

        const isMatch = await bcrypt.compare(passwordLama, credentials.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password lama Anda salah.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPasswordBaru = await bcrypt.hash(passwordBaru, salt);

        await userCredentialsRef.update({ password: hashedPasswordBaru });

        res.status(200).json({ message: 'Password berhasil diperbarui.' });

    } catch (error) {
        console.error("Error di changePassword:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengubah password.', error: error.message });
    }
};