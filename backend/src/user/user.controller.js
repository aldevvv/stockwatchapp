import db from '../config/firebase.js';

// Mengambil profil pengguna yang sedang login
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Diambil dari authMiddleware
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

// Mengupdate profil pengguna yang sedang login
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, nomorWhatsAppNotifikasi, namaToko } = req.body; // Data yang boleh diupdate

    // Validasi sederhana (bisa Anda kembangkan)
    if (!email || !nomorWhatsAppNotifikasi) {
      return res.status(400).json({ message: 'Email dan Nomor WhatsApp tidak boleh kosong.' });
    }

    const profileRef = db.ref(`users/${userId}/profile`);

    const profileDataToUpdate = {
      email,
      nomorWhatsAppNotifikasi,
      namaToko: namaToko || '' // Jika namaToko tidak ada, simpan string kosong
    };

    await profileRef.update(profileDataToUpdate);

    res.status(200).json({ message: 'Profil berhasil diperbarui', data: profileDataToUpdate });
  } catch (error) {
    console.error("Error di updateUserProfile:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};