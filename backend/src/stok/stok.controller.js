import db from '../config/firebase.js';

// Fungsi helper untuk mencatat riwayat stok ke path terpisah
const catatRiwayatStok = async (userId, itemId, namaBarangUntukRiwayat, jenisPerubahan, jumlahSebelum, jumlahPerubahan, jumlahSesudah, keterangan = '') => {
  try {
    // Path BARU untuk riwayat: riwayatStok -> userId -> itemId -> riwayatId
    const riwayatRef = db.ref(`riwayatStok/${userId}/${itemId}`);
    const newRiwayatRef = riwayatRef.push();
    const timestamp = new Date().toISOString();

    await newRiwayatRef.set({
      id: newRiwayatRef.key,
      timestamp,
      namaBarang: namaBarangUntukRiwayat, // Simpan nama barang di dalam data riwayat
      jenisPerubahan,
      jumlahSebelum,
      jumlahPerubahan,
      jumlahSesudah,
      keterangan
    });
    console.log(`Riwayat stok dicatat untuk item ${itemId} (${namaBarangUntukRiwayat}): ${jenisPerubahan} di path riwayatStok`);
  } catch (error) {
    console.error(`Gagal mencatat riwayat untuk item ${itemId} (${namaBarangUntukRiwayat}):`, error);
    // Pertimbangkan penanganan error lebih lanjut jika diperlukan
  }
};

export const createStok = async (req, res) => {
  try {
    const { namaBarang, jumlah, satuan, batasMinimum, supplier } = req.body;
    const userId = req.user.id;

    if (!namaBarang || jumlah === undefined || !satuan || batasMinimum === undefined) {
        return res.status(400).json({ message: 'Nama barang, jumlah, satuan, dan batas minimum wajib diisi.' });
    }

    const stokUserRef = db.ref(`users/${userId}/stok`);
    const newStokRef = stokUserRef.push();
    const jumlahAngka = Number(jumlah);
    const batasMinimumAngka = Number(batasMinimum);

    const barangBaru = {
      id: newStokRef.key,
      namaBarang,
      jumlah: jumlahAngka,
      satuan,
      batasMinimum: batasMinimumAngka,
      supplier: supplier || '',
      notifikasiStokRendahSudahTerkirim: null,
      createdAt: new Date().toISOString()
    };

    await newStokRef.set(barangBaru);

    // Catat riwayat untuk stok awal menggunakan path dan fungsi yang baru
    await catatRiwayatStok(
      userId,
      newStokRef.key,
      barangBaru.namaBarang, // Sertakan namaBarang
      'STOK_AWAL',
      0,
      jumlahAngka,
      jumlahAngka,
      'Stok awal saat barang dibuat'
    );

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
    const { id } = req.params; // ID item stok yang akan diupdate
    const dataToUpdate = req.body;

    const itemRef = db.ref(`users/${userId}/stok/${id}`);
    
    const snapshot = await itemRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    const currentItemData = snapshot.val();
    const jumlahSebelum = Number(currentItemData.jumlah);
    let keteranganRiwayat = 'Detail barang diubah';

    // Logika untuk pencatatan riwayat jika jumlah berubah
    if (dataToUpdate.hasOwnProperty('jumlah')) {
      const jumlahBaruAngka = Number(dataToUpdate.jumlah);
      if (jumlahBaruAngka !== jumlahSebelum) {
        const jumlahPerubahan = jumlahBaruAngka - jumlahSebelum;
        const jenisPerubahan = jumlahPerubahan > 0 ? 'PENAMBAHAN_MANUAL' : 'PENGURANGAN_MANUAL';
        keteranganRiwayat = `Jumlah stok diubah dari ${jumlahSebelum} menjadi ${jumlahBaruAngka}`;
        
        await catatRiwayatStok(
          userId,
          id,
          currentItemData.namaBarang, // Sertakan namaBarang dari data saat ini
          jenisPerubahan,
          jumlahSebelum,
          jumlahPerubahan,
          jumlahBaruAngka,
          keteranganRiwayat
        );
      }
      dataToUpdate.jumlah = jumlahBaruAngka;
    }
    
    if (dataToUpdate.hasOwnProperty('batasMinimum')) {
      dataToUpdate.batasMinimum = Number(dataToUpdate.batasMinimum);
    }
    if (dataToUpdate.hasOwnProperty('supplier') && (dataToUpdate.supplier === null || dataToUpdate.supplier === undefined)) {
        dataToUpdate.supplier = '';
    }

    const newJumlahForNotif = dataToUpdate.hasOwnProperty('jumlah') ? Number(dataToUpdate.jumlah) : jumlahSebelum;
    const newBatasMinimumForNotif = dataToUpdate.hasOwnProperty('batasMinimum') ? Number(dataToUpdate.batasMinimum) : Number(currentItemData.batasMinimum);

    if (newJumlahForNotif > newBatasMinimumForNotif && currentItemData.notifikasiStokRendahSudahTerkirim === true) {
      dataToUpdate.notifikasiStokRendahSudahTerkirim = null;
    } else if (newJumlahForNotif <= newBatasMinimumForNotif && currentItemData.notifikasiStokRendahSudahTerkirim === true) {
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

    const currentItemData = snapshot.val();
    const jumlahTerakhir = Number(currentItemData.jumlah);

    // Catat riwayat penghapusan SEBELUM benar-benar menghapus item
    await catatRiwayatStok(
      userId,
      id,
      currentItemData.namaBarang, // Sertakan namaBarang
      'HAPUS_BARANG',
      jumlahTerakhir,
      -jumlahTerakhir,
      0,
      'Barang dihapus dari sistem'
    );

    await itemRef.remove(); // Hapus item utama dari node 'stok'
    res.status(200).json({ message: 'Barang berhasil dihapus' });
  } catch (error) {
    console.error("Error di deleteStok:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};