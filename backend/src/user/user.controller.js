import db from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import admin from 'firebase-admin'; // <-- Impor admin untuk akses storage


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
    const dataToUpdate = req.body;

    if (!dataToUpdate.namaLengkap || !dataToUpdate.email || !dataToUpdate.nomorWhatsAppNotifikasi) {
      return res.status(400).json({ message: 'Nama Lengkap, Email, dan Nomor WhatsApp tidak boleh kosong.' });
    }
    
    // Pastikan nilai boolean dikelola dengan benar
    if (dataToUpdate.hasOwnProperty('preferensiNotifikasiEmail') && typeof dataToUpdate.preferensiNotifikasiEmail !== 'boolean') {
        dataToUpdate.preferensiNotifikasiEmail = true;
    }
     if (dataToUpdate.hasOwnProperty('preferensiNotifikasiWhatsApp') && typeof dataToUpdate.preferensiNotifikasiWhatsApp !== 'boolean') {
        dataToUpdate.preferensiNotifikasiWhatsApp = true;
    }


    const profileRef = db.ref(`users/${userId}/profile`);
    await profileRef.update(dataToUpdate);
    
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

export const deleteCurrentUserAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        if (!password) {
            return res.status(400).json({ message: 'Password dibutuhkan.' });
        }
        const userCredentialsRef = db.ref(`users/${userId}/credentials`);
        const snapshot = await userCredentialsRef.once('value');
        const credentials = snapshot.val();
        if (!credentials || !credentials.password) {
            return res.status(500).json({ message: 'Tidak dapat memverifikasi pengguna.' });
        }
        const isMatch = await bcrypt.compare(password, credentials.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah. Aksi dibatalkan.' });
        }
        await db.ref(`users/${userId}`).remove();
        res.status(200).json({ message: 'Akun Anda berhasil dihapus secara permanen.' });
    } catch (error) {
        console.error("Error di deleteCurrentUserAccount:", error);
        res.status(500).json({ message: 'Error server.', error: error.message });
    }
};

export const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah.' });
        }

        const bucket = admin.storage().bucket(`gs://${process.env.FIREBASE_STORAGE_BUCKET}`);
        const blob = bucket.file(`profile-pictures/<span class="math-inline">\{userId\}/</span>{Date.now()}_${req.file.originalname}`);

        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            console.error("Error saat upload ke Storage:", err);
            res.status(500).json({ message: 'Gagal mengunggah gambar.' });
        });

        blobStream.on('finish', async () => {
            // Buat URL publik untuk file tersebut
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/<span class="math-inline">\{bucket\.name\}/</span>{blob.name}`;

            // Simpan URL ke profil pengguna di Realtime Database
            const profileRef = db.ref(`users/${userId}/profile`);
            await profileRef.update({ fotoProfilUrl: publicUrl });

            // Ambil data profil terbaru untuk dikirim kembali
            const updatedProfileSnapshot = await profileRef.once('value');

            res.status(200).json({
                message: 'Foto profil berhasil diperbarui!',
                fotoProfilUrl: publicUrl,
                userProfile: updatedProfileSnapshot.val() // Kirim profil terbaru
            });
        });

        blobStream.end(req.file.buffer);

    } catch (error) {
        console.error("Error di uploadProfilePicture:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengunggah foto.', error: error.message });
    }
};