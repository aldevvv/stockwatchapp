import db from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { checkAndAwardAchievements } from '../achievements/achievement.service.js';

const catatRiwayatStok = async (userId, itemId, namaBarang, jenisPerubahan, jumlahSebelum, jumlahPerubahan, jumlahSesudah, hargaBeliSatuan = 0, keterangan = '') => {
  const riwayatItemRef = db.ref(`riwayatStok/${userId}/${itemId}`).push();
  await riwayatItemRef.set({
    id: riwayatItemRef.key, timestamp: Date.now(), namaBarang, jenisPerubahan,
    jumlahSebelum, jumlahPerubahan, jumlahSesudah,
    hargaBeliSatuan: parseFloat(hargaBeliSatuan) || 0,
    nilaiPerubahan: (jumlahPerubahan * parseFloat(hargaBeliSatuan)) || 0, keterangan
  });
};

export const tambahStokItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { namaBarang, jumlah, satuan, batasMinimum, supplier, hargaBeliSatuan, keterangan } = req.body;
        
        const parsedJumlah = Number(jumlah);
        const parsedHargaBeli = Number(hargaBeliSatuan);
        const itemId = uuidv4();
        
        const itemData = {
            id: itemId, namaBarang, jumlah: parsedJumlah, satuan, batasMinimum: Number(batasMinimum), supplier: supplier || '',
            hargaBeliAwal: parsedHargaBeli, hargaBeliTerakhir: parsedHargaBeli,
            createdAt: Date.now(), updatedAt: Date.now(),
        };
        
        await db.ref(`stok/${userId}/${itemId}`).set(itemData);
        await catatRiwayatStok(userId, itemId, namaBarang, 'STOK_AWAL', 0, parsedJumlah, parsedJumlah, parsedHargaBeli, keterangan || 'Stok awal ditambahkan');

        const statsRef = db.ref(`userStats/${userId}/stokCount`);
        await statsRef.transaction((currentCount) => (currentCount || 0) + 1);
        const unlockedAchievements = await checkAndAwardAchievements(userId, 'STOK_COUNT');

        res.status(201).json({ 
            message: 'Item stok berhasil ditambahkan!', 
            data: itemData,
            unlockedAchievements
        });
    } catch (error) {
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
        if (!snapshot.exists()) return res.status(404).json({ message: 'Barang tidak ditemukan.' });
        const currentData = snapshot.val();
        if (dataToUpdate.hasOwnProperty('jumlah')) {
            const jumlahSebelum = Number(currentData.jumlah);
            const jumlahBaru = Number(dataToUpdate.jumlah);
            if (jumlahBaru !== jumlahSebelum) {
                const jumlahPerubahan = jumlahBaru - jumlahSebelum;
                const jenisPerubahan = jumlahPerubahan > 0 ? 'PENAMBAHAN_MANUAL' : 'PENGURANGAN_MANUAL';
                let hargaBeliRiwayat = 0;
                if (jenisPerubahan === 'PENAMBAHAN_MANUAL' && dataToUpdate.hargaBeliSatuan !== undefined) {
                    hargaBeliRiwayat = Number(dataToUpdate.hargaBeliSatuan);
                    dataToUpdate.hargaBeliTerakhir = hargaBeliRiwayat; 
                } else {
                    hargaBeliRiwayat = currentData.hargaBeliTerakhir || 0;
                }
                await catatRiwayatStok(userId, itemId, currentData.namaBarang, jenisPerubahan, jumlahSebelum, jumlahPerubahan, jumlahBaru, hargaBeliRiwayat, dataToUpdate.keterangan || "Jumlah diubah manual");
            }
        }
        dataToUpdate.updatedAt = Date.now();
        if (dataToUpdate.hargaBeliSatuan) delete dataToUpdate.hargaBeliSatuan;
        await itemRef.update(dataToUpdate);
        const updatedSnapshot = await itemRef.once('value');
        res.status(200).json({ message: 'Stok berhasil diperbarui.', data: updatedSnapshot.val() });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const deleteStok = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const itemRef = db.ref(`stok/${userId}/${itemId}`);
        const snapshot = await itemRef.once('value');
        if (!snapshot.exists()) return res.status(404).json({ message: 'Barang tidak ditemukan.' });
        const itemData = snapshot.val();
        await catatRiwayatStok(userId, itemId, itemData.namaBarang, 'HAPUS_BARANG', Number(itemData.jumlah), -Number(itemData.jumlah), 0, (itemData.hargaBeliTerakhir || 0), "Barang dihapus");
        await itemRef.remove();
        res.status(200).json({ message: 'Barang berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const getAllStok = async (req, res) => {
    try {
        const userId = req.user.id;
        const stokRef = db.ref(`stok/${userId}`);
        const snapshot = await stokRef.orderByChild('namaBarang').once('value');
        if (!snapshot.exists()) return res.status(200).json({ message: 'Belum ada data stok.', data: [] });
        const stokList = [];
        snapshot.forEach(child => stokList.push(child.val()));
        res.status(200).json({ message: 'Data stok berhasil diambil', data: stokList });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const deleteAllStok = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        if (!password) return res.status(400).json({ message: 'Password dibutuhkan.' });
        const credsRef = db.ref(`users/${userId}/credentials`);
        const snapshot = await credsRef.once('value');
        const creds = snapshot.val();
        if (!creds?.password) return res.status(500).json({ message: 'Tidak dapat verifikasi.' });
        const isMatch = await bcrypt.compare(password, creds.password);
        if (!isMatch) return res.status(401).json({ message: 'Password salah.' });
        await db.ref(`stok/${userId}`).remove();
        await db.ref(`riwayatStok/${userId}`).remove();
        res.status(200).json({ message: 'Semua data stok dan riwayatnya berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan.', error: error.message });
    }
};