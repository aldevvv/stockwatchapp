// backend/src/stok/stok.controller.js

import db from '../config/firebase.js';

/**
 * Controller untuk menambah data stok baru milik pengguna yang sedang login.
 * Menyimpan stok di bawah node users/{userId}/stok/
 */
export const createStok = async (req, res) => {
  try {
    const { namaBarang, jumlah, satuan, batasMinimum } = req.body;
    const userId = req.user.id; // Diambil dari authMiddleware

    // Path ke data stok spesifik untuk user ini
    const stokUserRef = db.ref(`users/${userId}/stok`);
    const newStokRef = stokUserRef.push(); // Firebase akan generate ID unik untuk item stok

    const barangBaru = {
      id: newStokRef.key, // Simpan ID unik yang digenerate Firebase
      namaBarang,
      jumlah: Number(jumlah),
      satuan,
      batasMinimum: Number(batasMinimum),
      notifikasiStokRendahSudahTerkirim: null, // Status awal notifikasi
      createdAt: new Date().toISOString()
    };

    await newStokRef.set(barangBaru);
    res.status(201).json({ message: 'Barang berhasil ditambahkan', data: barangBaru });
  } catch (error) {
    console.error("Error di createStok:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

/**
 * Controller untuk mengambil semua data stok milik pengguna yang sedang login.
 * Mengambil stok dari node users/{userId}/stok/
 */
export const getAllStok = async (req, res) => {
  try {
    const userId = req.user.id;
    const stokUserRef = db.ref(`users/${userId}/stok`);

    const snapshot = await stokUserRef.once('value');
    const data = snapshot.val();
    const dataList = data ? Object.values(data) : [];

    res.status(200).json({ message: 'Data stok berhasil diambil', data: dataList });
  } catch (error) {
    console.error("Error di getAllStok:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

/**
 * Controller untuk mengupdate data stok spesifik.
 * Mengupdate stok di node users/{userId}/stok/{id}
 */
export const updateStok = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // ID item stok yang akan diupdate
    const dataToUpdate = req.body;

    // Path ke item stok spesifik
    const itemRef = db.ref(`users/${userId}/stok/${id}`);
    
    const snapshot = await itemRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    const currentItemData = snapshot.val();

    // Pastikan jumlah dan batasMinimum yang baru adalah angka
    if (dataToUpdate.hasOwnProperty('jumlah')) {
      dataToUpdate.jumlah = Number(dataToUpdate.jumlah);
    }
    if (dataToUpdate.hasOwnProperty('batasMinimum')) {
      dataToUpdate.batasMinimum = Number(dataToUpdate.batasMinimum);
    }
    
    const newJumlah = dataToUpdate.hasOwnProperty('jumlah') ? dataToUpdate.jumlah : Number(currentItemData.jumlah);
    const newBatasMinimum = dataToUpdate.hasOwnProperty('batasMinimum') ? dataToUpdate.batasMinimum : Number(currentItemData.batasMinimum);


    // Logika reset status notifikasi jika jumlah baru sudah di atas batas minimum
    if (newJumlah > newBatasMinimum && currentItemData.notifikasiStokRendahSudahTerkirim === true) {
      dataToUpdate.notifikasiStokRendahSudahTerkirim = null; 
      console.log(`Resetting notifikasiStokRendahSudahTerkirim untuk item ${id} (User: ${userId}) karena restock.`);
    } else if (newJumlah <= newBatasMinimum && currentItemData.notifikasiStokRendahSudahTerkirim === true) {
      // Jika jumlah baru masih rendah (atau sama dengan batas) dan notif sudah terkirim,
      // JANGAN ubah status notifikasiStokRendahSudahTerkirim. Biarkan tetap true.
      dataToUpdate.notifikasiStokRendahSudahTerkirim = true;
    }
    
    await itemRef.update(dataToUpdate);
    const updatedSnapshot = await itemRef.once('value');

    res.status(200).json({ message: 'Barang berhasil diupdate', data: updatedSnapshot.val() });
  } catch (error) {
    console.error("Error di updateStok:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

/**
 * Controller untuk menghapus data stok spesifik.
 * Menghapus stok dari node users/{userId}/stok/{id}
 */
export const deleteStok = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // ID item stok yang akan dihapus

    const itemRef = db.ref(`users/${userId}/stok/${id}`);

    const snapshot = await itemRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    await itemRef.remove();
    res.status(200).json({ message: 'Barang berhasil dihapus' });
  } catch (error)
 {
    console.error("Error di deleteStok:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};