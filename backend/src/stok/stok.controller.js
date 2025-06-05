import db from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

const catatRiwayatStok = async (userId, itemId, namaBarangUntukRiwayat, jenisPerubahan, jumlahSebelum, jumlahPerubahan, jumlahSesudah, hargaBeliSatuan = 0, keterangan = '') => {
  try {
    const riwayatRef = db.ref(`users/${userId}/riwayatStok/${itemId}`);
    const newRiwayatRef = riwayatRef.push();
    const timestamp = new Date().toISOString();
    const nilaiPerubahan = jumlahPerubahan * hargaBeliSatuan;

    await newRiwayatRef.set({
      id: newRiwayatRef.key,
      timestamp,
      namaBarang: namaBarangUntukRiwayat,
      jenisPerubahan,
      jumlahSebelum,
      jumlahPerubahan,
      jumlahSesudah,
      hargaBeliSatuan,
      nilaiPerubahan,
      tipeNilai: 'modal',
      keterangan
    });
    console.log(`Riwayat stok dicatat untuk item ${itemId} (${namaBarangUntukRiwayat}): ${jenisPerubahan} di path riwayatStok`);
  } catch (error) {
    console.error(`Gagal mencatat riwayat untuk item ${itemId} (${namaBarangUntukRiwayat}):`, error);
  }
};

export const tambahStokItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            namaBarang, 
            jumlah, 
            satuan, 
            batasMinimum, 
            supplier, 
            keterangan,
            hargaBeliSatuan 
        } = req.body;

        if (!namaBarang || jumlah === undefined || !satuan || batasMinimum === undefined || hargaBeliSatuan === undefined) {
            return res.status(400).json({ message: 'Nama barang, jumlah, satuan, batas minimum, dan harga beli satuan wajib diisi.' });
        }
        
        const parsedJumlah = parseInt(jumlah, 10);
        const parsedBatasMinimum = parseInt(batasMinimum, 10);
        const parsedHargaBeliSatuan = parseFloat(hargaBeliSatuan);

        if (isNaN(parsedJumlah) || isNaN(parsedBatasMinimum) || isNaN(parsedHargaBeliSatuan)) {
            return res.status(400).json({ message: 'Jumlah, batas minimum, dan harga beli satuan harus berupa angka.' });
        }
        if (parsedHargaBeliSatuan < 0) {
            return res.status(400).json({ message: 'Harga beli satuan tidak boleh negatif.' });
        }

        const itemId = uuidv4();
        const timestamp = new Date().toISOString();
        const itemStokRef = db.ref(`users/${userId}/stok/${itemId}`);

        const itemData = {
            id: itemId,
            namaBarang,
            jumlah: parsedJumlah,
            satuan,
            batasMinimum: parsedBatasMinimum,
            supplier: supplier || '',
            keterangan: keterangan || '',
            hargaBeliAwal: parsedHargaBeliSatuan,
            hargaBeliTerakhir: parsedHargaBeliSatuan,
            notifikasiStokRendahSudahTerkirim: parsedJumlah <= parsedBatasMinimum ? true : null,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        await itemStokRef.set(itemData);

        await catatRiwayatStok(
            userId,
            itemId,
            namaBarang,
            'STOK_AWAL',
            0,
            parsedJumlah,
            parsedJumlah,
            parsedHargaBeliSatuan,
            keterangan || 'Stok awal ditambahkan'
        );

        res.status(201).json({ message: 'Item stok berhasil ditambahkan beserta riwayatnya!', data: itemData });

    } catch (error) {
        console.error("Error di tambahStokItem:", error);
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

export const updateJumlahStok = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { jenisPerubahan, jumlahPerubahan, keterangan, hargaBeliSatuan } = req.body;

        if (!itemId || !jenisPerubahan || jumlahPerubahan === undefined) {
            return res.status(400).json({ message: 'itemId, jenisPerubahan, dan jumlahPerubahan wajib diisi.' });
        }

        const parsedJumlahPerubahan = parseInt(jumlahPerubahan, 10);
        if (isNaN(parsedJumlahPerubahan)) {
            return res.status(400).json({ message: 'Jumlah perubahan harus berupa angka.' });
        }
        
        let parsedHargaBeliSatuan;
        if (jenisPerubahan === 'PENAMBAHAN_MANUAL') {
            if (hargaBeliSatuan === undefined) {
                return res.status(400).json({ message: 'Harga beli satuan wajib diisi untuk penambahan stok.' });
            }
            parsedHargaBeliSatuan = parseFloat(hargaBeliSatuan);
            if (isNaN(parsedHargaBeliSatuan) || parsedHargaBeliSatuan < 0) {
                return res.status(400).json({ message: 'Harga beli satuan tidak valid.' });
            }
        }

        const itemStokRef = db.ref(`users/${userId}/stok/${itemId}`);
        const snapshot = await itemStokRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ message: `Item stok dengan ID ${itemId} tidak ditemukan.` });
        }

        const itemData = snapshot.val();
        const jumlahSebelum = Number(itemData.jumlah);
        const jumlahSesudah = jumlahSebelum + parsedJumlahPerubahan;

        if (jumlahSesudah < 0) {
            return res.status(400).json({ message: 'Jumlah stok tidak bisa menjadi negatif.' });
        }

        const updateDataUntukStok = {
            jumlah: jumlahSesudah,
            updatedAt: new Date().toISOString(),
        };
        
        if (jumlahSesudah <= Number(itemData.batasMinimum)) {
            if (itemData.notifikasiStokRendahSudahTerkirim !== true) {
                 updateDataUntukStok.notifikasiStokRendahSudahTerkirim = null; // Akan ditangani scheduler
            }
        } else {
            updateDataUntukStok.notifikasiStokRendahSudahTerkirim = null;
        }


        let hargaBeliUntukRiwayat = 0;
        if (jenisPerubahan === 'PENAMBAHAN_MANUAL') {
            hargaBeliUntukRiwayat = parsedHargaBeliSatuan;
            updateDataUntukStok.hargaBeliTerakhir = parsedHargaBeliSatuan;
        } else if (jenisPerubahan === 'PENGURANGAN_MANUAL') {
            hargaBeliUntukRiwayat = itemData.hargaBeliTerakhir || itemData.hargaBeliAwal || 0;
        }

        await itemStokRef.update(updateDataUntukStok);
        
        await catatRiwayatStok(
            userId,
            itemId,
            itemData.namaBarang,
            jenisPerubahan,
            jumlahSebelum,
            parsedJumlahPerubahan,
            jumlahSesudah,
            hargaBeliUntukRiwayat,
            keterangan || `Jumlah stok diubah secara manual`
        );

        const updatedItemSnapshot = await itemStokRef.once('value');
        res.status(200).json({ message: 'Jumlah stok berhasil diperbarui beserta riwayatnya!', data: updatedItemSnapshot.val() });

    } catch (error) {
        console.error("Error di updateJumlahStok:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const updateDetailStokItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { namaBarang, satuan, batasMinimum, supplier, keterangan, hargaBeliAwal, hargaBeliTerakhir } = req.body;

        if (!itemId) {
            return res.status(400).json({ message: 'Item ID wajib diisi.' });
        }
        if (!namaBarang || !satuan || batasMinimum === undefined ) {
            return res.status(400).json({ message: 'Nama barang, satuan, dan batas minimum wajib diisi.' });
        }
        
        const parsedBatasMinimum = parseInt(batasMinimum, 10);
        if (isNaN(parsedBatasMinimum)) {
            return res.status(400).json({ message: 'Batas minimum harus berupa angka.' });
        }

        const itemStokRef = db.ref(`users/${userId}/stok/${itemId}`);
        const snapshot = await itemStokRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: `Item stok dengan ID ${itemId} tidak ditemukan.` });
        }
        
        const itemData = snapshot.val();
        const dataToUpdate = {
            namaBarang,
            satuan,
            batasMinimum: parsedBatasMinimum,
            supplier: supplier !== undefined ? (supplier || '') : itemData.supplier,
            keterangan: keterangan !== undefined ? (keterangan || '') : itemData.keterangan,
            updatedAt: new Date().toISOString()
        };

        let hargaBeliAwalChanged = false;
        if (hargaBeliAwal !== undefined) {
            const parsedHargaBeliAwal = parseFloat(hargaBeliAwal);
            if (!isNaN(parsedHargaBeliAwal) && parsedHargaBeliAwal >= 0) {
                dataToUpdate.hargaBeliAwal = parsedHargaBeliAwal;
                if (itemData.hargaBeliAwal !== parsedHargaBeliAwal) hargaBeliAwalChanged = true;
            } else {
                 return res.status(400).json({ message: 'Format Harga Beli Awal tidak valid.' });
            }
        }

        let hargaBeliTerakhirChanged = false;
        if (hargaBeliTerakhir !== undefined) {
            const parsedHargaBeliTerakhir = parseFloat(hargaBeliTerakhir);
            if (!isNaN(parsedHargaBeliTerakhir) && parsedHargaBeliTerakhir >= 0) {
                dataToUpdate.hargaBeliTerakhir = parsedHargaBeliTerakhir;
                 if (itemData.hargaBeliTerakhir !== parsedHargaBeliTerakhir) hargaBeliTerakhirChanged = true;
            } else {
                return res.status(400).json({ message: 'Format Harga Beli Terakhir tidak valid.' });
            }
        }
        
        const detailTelahBerubah = Object.keys(dataToUpdate).some(key => key !== 'updatedAt' && dataToUpdate[key] !== itemData[key]);

        if (detailTelahBerubah) {
             await itemStokRef.update(dataToUpdate);
        
            let keteranganRiwayat = 'Detail barang diubah.';
            if (hargaBeliAwalChanged && hargaBeliTerakhirChanged) {
                keteranganRiwayat = 'Detail barang, Harga Beli Awal & Terakhir diubah.';
            } else if (hargaBeliAwalChanged) {
                keteranganRiwayat = 'Detail barang & Harga Beli Awal diubah.';
            } else if (hargaBeliTerakhirChanged) {
                keteranganRiwayat = 'Detail barang & Harga Beli Terakhir diubah.';
            }
            
            await catatRiwayatStok(
                userId,
                itemId,
                dataToUpdate.namaBarang,
                'EDIT_DETAIL_BARANG',
                itemData.jumlah,
                0, 
                itemData.jumlah,
                0, 
                keteranganRiwayat
            );
        } else {
            return res.status(200).json({ message: 'Tidak ada perubahan detail pada item stok.', data: itemData });
        }

        const updatedItemSnapshot = await itemStokRef.once('value');
        res.status(200).json({ message: 'Detail item stok berhasil diperbarui!', data: updatedItemSnapshot.val() });

    } catch (error) {
        console.error("Error di updateDetailStokItem:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const hapusStokItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const itemRef = db.ref(`users/${userId}/stok/${itemId}`);

    const snapshot = await itemRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }

    const currentItemData = snapshot.val();
    const jumlahTerakhir = Number(currentItemData.jumlah);
    const hargaBeliUntukRiwayat = currentItemData.hargaBeliTerakhir || currentItemData.hargaBeliAwal || 0;

    await catatRiwayatStok(
      userId,
      itemId,
      currentItemData.namaBarang,
      'HAPUS_BARANG',
      jumlahTerakhir,
      -jumlahTerakhir,
      0,
      hargaBeliUntukRiwayat,
      'Barang dihapus dari sistem'
    );

    await itemRef.remove();
    res.status(200).json({ message: 'Barang berhasil dihapus' });
  } catch (error) {
    console.error("Error di hapusStokItem:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};