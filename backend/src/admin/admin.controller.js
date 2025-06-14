import db from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

export const getPlatformStats = async (req, res) => {
    try {
        const [
            usersSnap, stokSnap, suppliersSnap, 
            produkJadiSnap, penjualanSnap, stockListingsSnap, redeemCodesSnap
        ] = await Promise.all([
            db.ref('users').once('value'),
            db.ref('stok').once('value'),
            db.ref('suppliers').once('value'),
            db.ref('produkJadi').once('value'),
            db.ref('penjualan').once('value'),
            db.ref('stockListings').once('value'),
            db.ref('redeemCodes').once('value'),
        ]);

        const allUsers = usersSnap.val() || {};
        const allStok = stokSnap.val() || {};
        const allSuppliers = suppliersSnap.val() || {};
        const allProdukJadi = produkJadiSnap.val() || {};
        const allPenjualan = penjualanSnap.val() || {};
        const allListings = stockListingsSnap.val() || {};
        const allRedeemCodes = redeemCodesSnap.val() || {};

        const totalUsers = Object.keys(allUsers).filter(key => allUsers[key].profile?.role !== 'admin').length;
        
        let totalStokItems = 0;
        Object.values(allStok).forEach(userStok => { totalStokItems += Object.keys(userStok).length; });

        let totalSuppliers = 0;
        Object.values(allSuppliers).forEach(userSuppliers => { totalSuppliers += Object.keys(userSuppliers).length; });
        
        let totalProdukJadi = 0;
        Object.values(allProdukJadi).forEach(userProduk => { totalProdukJadi += Object.keys(userProduk).length; });

        let totalPenjualan = 0;
        Object.values(allPenjualan).forEach(userPenjualan => {
            Object.values(userPenjualan).forEach(transaksi => {
                totalPenjualan += transaksi.totalPenjualan || 0;
            });
        });

        let totalSaldo = 0;
        Object.values(allUsers).forEach(user => {
            totalSaldo += user.profile?.saldo || 0;
        });

        let usedCodes = 0;
        Object.values(allRedeemCodes).forEach(code => { usedCodes += (code.redeemCount || 0); });

        res.status(200).json({
            totalUsers,
            totalStokItems,
            totalSuppliers,
            totalProdukJadi,
            totalPenjualan,
            totalSaldo,
            totalListings: Object.keys(allListings).length,
            totalRedeemCodes: Object.keys(allRedeemCodes).length,
            usedRedeemCodes: usedCodes
        });
    } catch (error) {
        console.error("Error getting platform stats:", error);
        res.status(500).json({ message: "Gagal mengambil statistik platform." });
    }
};

export const getAllUsersProfiles = async (req, res) => {
    try {
        const usersRef = db.ref('users');
        const snapshot = await usersRef.once('value');
        const allUsersData = snapshot.val();
        if (!allUsersData) {
            return res.status(200).json({ data: [] });
        }
        const profiles = Object.keys(allUsersData).map(userId => ({ id: userId, ...(allUsersData[userId].profile || {}) }));
        res.status(200).json({ data: profiles });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pengguna.' });
    }
};

export const getUserDetailsForAdmin = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        if (!targetUserId) {
            return res.status(400).json({ message: 'User ID target dibutuhkan.' });
        }
        
        const profileRef = db.ref(`users/${targetUserId}/profile`);
        const stokRef = db.ref(`stok/${targetUserId}`);
        const supplierRef = db.ref(`suppliers/${targetUserId}`);
        const produkRef = db.ref(`produkJadi/${targetUserId}`);

        const [profileSnap, stokSnap, supplierSnap, produkSnap] = await Promise.all([
            profileRef.once('value'),
            stokRef.once('value'),
            supplierRef.once('value'),
            produkRef.once('value')
        ]);

        if (!profileSnap.exists()) {
            return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }

        const userDetails = {
            profile: profileSnap.val(),
            jumlahStok: stokSnap.numChildren(),
            jumlahSupplier: supplierSnap.numChildren(),
            jumlahProduk: produkSnap.numChildren()
        };

        res.status(200).json({ data: userDetails });
    } catch (error) {
        console.error("Error getting user details for admin:", error);
        res.status(500).json({ message: "Gagal mengambil detail pengguna." });
    }
};

export const addSaldoToUser = async (req, res) => {
    try {
        const { targetUserId, jumlah, catatan } = req.body;
        if (!targetUserId || !jumlah) {
            return res.status(400).json({ message: "User ID dan Jumlah saldo wajib diisi." });
        }
        const profileRef = db.ref(`users/${targetUserId}/profile`);
        const snapshot = await profileRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }
        const profile = snapshot.val();
        const saldoSekarang = profile.saldo || 0;
        const saldoBaru = saldoSekarang + Number(jumlah);

        const historyRef = db.ref(`saldoHistory/${targetUserId}`).push();
        const historyData = {
            id: historyRef.key,
            tanggal: Date.now(),
            deskripsi: catatan || `Penambahan Saldo Manual oleh Admin`,
            jumlah: Number(jumlah),
            tipe: 'debit'
        };

        const updates = {};
        updates[`users/${targetUserId}/profile/saldo`] = saldoBaru;
        updates[`saldoHistory/${targetUserId}/${historyRef.key}`] = historyData;

        await db.ref().update(updates);
        res.status(200).json({ message: `Saldo berhasil ditambahkan ke akun ${profile.namaLengkap}.` });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan saldo." });
    }
};

export const createRedeemCode = async (req, res) => {
    try {
        const { value, limit, type = 'saldo' } = req.body;
        if (!value || !limit) {
            return res.status(400).json({ message: "Nilai dan batas redeem wajib diisi." });
        }
        const newCode = `SW-${uuidv4().split('-')[0].toUpperCase()}`;
        const codeData = {
            code: newCode, type, value: Number(value),
            limit: Number(limit), redeemCount: 0,
            isActive: true, createdAt: Date.now()
        };
        await db.ref(`redeemCodes/${newCode}`).set(codeData);
        res.status(201).json({ message: `Kode redeem ${newCode} berhasil dibuat.`, data: codeData });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat kode redeem." });
    }
};
    
export const getAllRedeemCodes = async (req, res) => {
    try {
        const codesSnapshot = await db.ref('redeemCodes').orderByChild('createdAt').once('value');
        if (!codesSnapshot.exists()) {
            return res.status(200).json({ data: [] });
        }
        const codesList = [];
        codesSnapshot.forEach(snap => {
            codesList.push(snap.val());
        });
        res.status(200).json({ data: codesList.reverse() });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kode redeem." });
    }
};

export const updateRedeemCode = async (req, res) => {
    try {
        const { codeId } = req.params;
        const { limit, isActive } = req.body;
        const codeRef = db.ref(`redeemCodes/${codeId}`);
        const snapshot = await codeRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: "Kode tidak ditemukan." });
        }
        const updates = {
            limit: Number(limit),
            isActive: isActive,
        };
        await codeRef.update(updates);
        res.status(200).json({ message: "Kode redeem berhasil diperbarui." });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui kode." });
    }
};

export const deleteRedeemCode = async (req, res) => {
    try {
        const { codeId } = req.params;
        const codeRef = db.ref(`redeemCodes/${codeId}`);
        await codeRef.remove();
        res.status(200).json({ message: "Kode redeem berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus kode." });
    }
};