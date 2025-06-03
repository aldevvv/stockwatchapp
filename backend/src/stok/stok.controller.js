import db from '../config/firebase.js';

export const createStok = async (req, res) => {
  try {
    const { namaBarang, jumlah, satuan, batasMinimum, supplier } = req.body;
    const userId = req.user.id;

    if (!namaBarang || !jumlah || !satuan || !batasMinimum) {
        return res.status(400).json({ message: 'Nama barang, jumlah, satuan, dan batas minimum wajib diisi.' });
    }

    const stokUserRef = db.ref(`users/${userId}/stok`);
    const newStokRef = stokUserRef.push();

    const barangBaru = {
      id: newStokRef.key,
      namaBarang,
      jumlah: Number(jumlah),
      satuan,
      batasMinimum: Number(batasMinimum),
      supplier: supplier || '',
      notifikasiStokRendahSudahTerkirim: null,
      createdAt: new Date().toISOString()
    };

    await newStokRef.set(barangBaru);
    res.status(201).json({ message: 'Barang berhasil ditambahkan', data: barangBaru });
  } catch (error) {
    console.error("Error di createStok:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

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

export const updateStok = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const dataToUpdate = req.body;

    if (dataToUpdate.hasOwnProperty('supplier')) {
        dataToUpdate.supplier = dataToUpdate.supplier || '';
    }

    const itemRef = db.ref(`users/${userId}/stok/${id}`);
    
    const snapshot = await itemRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    const currentItemData = snapshot.val();

    if (dataToUpdate.hasOwnProperty('jumlah')) {
      dataToUpdate.jumlah = Number(dataToUpdate.jumlah);
    }
    if (dataToUpdate.hasOwnProperty('batasMinimum')) {
      dataToUpdate.batasMinimum = Number(dataToUpdate.batasMinimum);
    }
    
    const newJumlah = dataToUpdate.hasOwnProperty('jumlah') ? dataToUpdate.jumlah : Number(currentItemData.jumlah);
    const newBatasMinimum = dataToUpdate.hasOwnProperty('batasMinimum') ? dataToUpdate.batasMinimum : Number(currentItemData.batasMinimum);


    if (newJumlah > newBatasMinimum && currentItemData.notifikasiStokRendahSudahTerkirim === true) {
      dataToUpdate.notifikasiStokRendahSudahTerkirim = null; 
      console.log(`Resetting notifikasiStokRendahSudahTerkirim untuk item ${id} (User: ${userId}) karena restock.`);
    } else if (newJumlah <= newBatasMinimum && currentItemData.notifikasiStokRendahSudahTerkirim === true) {
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

export const deleteStok = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const itemRef = db.ref(`users/${userId}/stok/${id}`);

    const snapshot = await itemRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    await itemRef.remove();
    res.status(200).json({ message: 'Barang berhasil dihapus' });
  } catch (error) {
    console.error("Error di deleteStok:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};