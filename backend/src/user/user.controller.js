import db from '../config/firebase.js';

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
    const { namaLengkap, email, nomorWhatsAppNotifikasi, namaToko } = req.body;

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

    await profileRef.update(profileDataToUpdate);
    res.status(200).json({ message: 'Profil berhasil diperbarui', data: profileDataToUpdate });
  } catch (error) {
    console.error("Error di updateUserProfile:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};