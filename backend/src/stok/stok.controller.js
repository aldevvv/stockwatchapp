import db from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const catatRiwayatStok = async (userId, itemId, namaBarang, jenisPerubahan, jumlahSebelum, jumlahPerubahan, jumlahSesudah, hargaBeliSatuan = 0, keterangan = '') => {
  try {
    const riwayatItemRef = db.ref(`riwayatStok/${userId}/${itemId}`).push();
    
    await riwayatItemRef.set({
      id: riwayatItemRef.key,
      timestamp: Date.now(),
      namaBarang,
      jenisPerubahan,
      jumlahSebelum,
      jumlahPerubahan,
      jumlahSesudah,
      hargaBeliSatuan: parseFloat(hargaBeliSatuan) || 0,
      nilaiPerubahan: (jumlahPerubahan * parseFloat(hargaBeliSatuan)) || 0,
      keterangan,
    });
  } catch (error) {
    console.error(`Gagal mencatat riwayat untuk item ${itemId}:`, error);
    throw error;
  }
};


export const tambahStokItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { namaBarang, jumlah, satuan, batasMinimum, supplier, hargaBeliSatuan, keterangan } = req.body;
        
        if (!namaBarang || jumlah === undefined || !satuan || batasMinimum === undefined || hargaBeliSatuan === undefined) {
            return res.status(400).json({ message: 'Field yang wajib diisi tidak boleh kosong.' });
        }
        
        const parsedJumlah = Number(jumlah);
        const parsedHargaBeli = Number(hargaBeliSatuan);
        const timestamp = Date.now();
        const itemId = uuidv4();
        
        const itemData = {
            id: itemId, namaBarang, jumlah: parsedJumlah, satuan, batasMinimum: Number(batasMinimum), supplier: supplier || '',
            hargaBeliAwal: parsedHargaBeli, hargaBeliTerakhir: parsedHargaBeli,
            createdAt: timestamp, updatedAt: timestamp,
        };
        
        await db.ref(`stok/${userId}/${itemId}`).set(itemData);
        await catatRiwayatStok(userId, itemId, namaBarang, 'STOK_AWAL', 0, parsedJumlah, parsedJumlah, parsedHargaBeli, keterangan || 'Stok Awal Ditambahkan');

        res.status(201).json({ message: 'Item stok berhasil ditambahkan!', data: itemData });
    } catch (error) {
        console.error("Error di tambahStokItem:", error);
        res.status(500).json({ message: 'Gagal menambahkan stok.', error: error.message });
    }
};

export const updateStok = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const dataToUpdate = req.body;
        
        const itemRef = db.ref(`stok/${userId}/${itemId}`);
        const snapshot = await itemRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'Barang tidak ditemukan.' });
        }

        const currentData = snapshot.val();
        const jumlahSebelum = Number(currentData.jumlah);
        
        if (dataToUpdate.hasOwnProperty('jumlah')) {
            const jumlahBaru = Number(dataToUpdate.jumlah);
            if (jumlahBaru !== jumlahSebelum) {
                const jumlahPerubahan = jumlahBaru - jumlahSebelum;
                const jenisPerubahan = jumlahPerubahan > 0 ? 'PENAMBAHAN_MANUAL' : 'PENGURANGAN_MANUAL';
                
                let hargaBeliUntukRiwayat = 0;
                if (jenisPerubahan === 'PENAMBAHAN_MANUAL' && dataToUpdate.hargaBeliSatuan !== undefined) {
                    hargaBeliUntukRiwayat = Number(dataToUpdate.hargaBeliSatuan);
                    dataToUpdate.hargaBeliTerakhir = hargaBeliUntukRiwayat; 
                } else {
                    hargaBeliUntukRiwayat = currentData.hargaBeliTerakhir || currentData.hargaBeliAwal || 0;
                }
                await catatRiwayatStok(userId, itemId, currentData.namaBarang, jenisPerubahan, jumlahSebelum, jumlahPerubahan, jumlahBaru, hargaBeliUntukRiwayat, dataToUpdate.keterangan || "Jumlah Diubah Manual");
            }
        }
        
        dataToUpdate.updatedAt = Date.now();
        if (dataToUpdate.hargaBeliSatuan) {
            delete dataToUpdate.hargaBeliSatuan;
        }

        await itemRef.update(dataToUpdate);
        
        const updatedSnapshot = await itemRef.once('value');
        res.status(200).json({ message: 'Stok berhasil diperbarui.', data: updatedSnapshot.val() });
    } catch (error) {
        console.error("Error di updateStok:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const deleteStok = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const itemRef = db.ref(`stok/${userId}/${itemId}`);
        const snapshot = await itemRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'Barang tidak ditemukan.' });
        }

        const itemData = snapshot.val();
        await catatRiwayatStok(userId, itemId, itemData.namaBarang, 'HAPUS_BARANG', Number(itemData.jumlah), -Number(itemData.jumlah), 0, (itemData.hargaBeliTerakhir || 0), "Barang Dihapus Dari Sistem");
        
        await itemRef.remove();
        res.status(200).json({ message: 'Barang berhasil dihapus.' });
    } catch (error) {
        console.error("Error di deleteStok:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};


export const getAllStok = async (req, res) => {
    try {
        const userId = req.user.id;
        const stokRef = db.ref(`stok/${userId}`);
        const snapshot = await stokRef.orderByChild('namaBarang').once('value');
        
        if (!snapshot.exists()) {
            return res.status(200).json({ message: 'Belum ada data stok.', data: [] });
        }
        const stokList = [];
        snapshot.forEach(childSnapshot => {
            stokList.push(childSnapshot.val());
        });
        res.status(200).json({ message: 'Data stok berhasil diambil', data: stokList });
    } catch (error) {
        console.error("Error di getAllStok:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const deleteAllStok = async (req, res) => {
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
        await db.ref(`stok/${userId}`).remove();
        await db.ref(`riwayatStok/${userId}`).remove();
        res.status(200).json({ message: 'Semua data stok dan riwayatnya berhasil dihapus.' });
    } catch (error) {
        console.error("Error di deleteAllStok:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};