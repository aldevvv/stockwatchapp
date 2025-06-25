import db from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import admin from 'firebase-admin';

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
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const dataToUpdate = req.body;
    const profileRef = db.ref(`users/${userId}/profile`);
    await profileRef.update(dataToUpdate);
    const updatedSnapshot = await profileRef.once('value');
    res.status(200).json({ message: 'Profil berhasil diperbarui', data: updatedSnapshot.val() });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passwordLama, passwordBaru } = req.body;
    if (!passwordLama || !passwordBaru) {
      return res.status(400).json({ message: 'Semua field password wajib diisi.' });
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
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const deactivateAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        if (!password) {
            return res.status(400).json({ message: 'Password dibutuhkan untuk konfirmasi.' });
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
        await db.ref(`users/${userId}/profile`).update({ statusAkun: 'dinonaktifkan' });
        res.status(200).json({ message: 'Akun Anda berhasil dinonaktifkan.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
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
      return res.status(401).json({ message: 'Password salah.' });
    }
    await Promise.all([
      db.ref(`users/${userId}`).remove(),
      db.ref(`stok/${userId}`).remove(),
      db.ref(`suppliers/${userId}`).remove(),
      db.ref(`riwayatStok/${userId}`).remove(),
      db.ref(`produkJadi/${userId}`).remove(),
      db.ref(`penjualan/${userId}`).remove()
    ]);
    res.status(200).json({ message: 'Akun Anda dan semua data terkait berhasil dihapus secara permanen.' });
  } catch (error) {
    res.status(500).json({ message: 'Error server.', error: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah.' });
    }
    const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const blob = bucket.file(`profile-pictures/${userId}/${Date.now()}_${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
        metadata: { contentType: req.file.mimetype },
    });
    blobStream.on('error', (err) => {
        res.status(500).json({ message: 'Gagal mengunggah gambar.' });
    });
    blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        const profileRef = db.ref(`users/${userId}/profile`);
        await profileRef.update({ fotoProfilUrl: publicUrl });
        const updatedProfileSnapshot = await profileRef.once('value');
        res.status(200).json({ message: 'Foto profil berhasil diperbarui!', fotoProfilUrl: publicUrl, userProfile: updatedProfileSnapshot.val() });
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};