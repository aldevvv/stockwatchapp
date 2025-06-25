import db from '../config/firebase.js';

export const calculateAndStoreLeaderboards = async () => {
    console.log("Memulai perhitungan semua leaderboard (All-Time)...");
    try {
        const [usersSnap, allPenjualanSnap] = await Promise.all([
            db.ref('users').once('value'),
            db.ref('penjualan').once('value')
        ]);

        const usersData = usersSnap.val() || {};
        const allPenjualanData = allPenjualanSnap.val() || {};
        const userStats = {};

        // Inisialisasi statistik untuk semua pengguna, pastikan namaLengkap ada
        for (const userId in usersData) {
            const profile = usersData[userId].profile;
            if (profile?.role !== 'admin') {
                userStats[userId] = {
                    userId: userId,
                    namaLengkap: profile?.namaLengkap || 'Pengguna',
                    namaToko: profile?.namaToko || 'Tanpa Nama',
                    fotoProfilUrl: profile?.fotoProfilUrl || '',
                    transactionCount: 0,
                    totalProfit: 0,
                    totalSaldo: profile?.saldo || 0,
                };
            }
        }

        // Agregasi data penjualan untuk semua waktu
        for (const userId in allPenjualanData) {
            if (userStats[userId]) {
                const userTransactions = Object.values(allPenjualanData[userId]);
                userStats[userId].transactionCount = userTransactions.length;
                userStats[userId].totalProfit = userTransactions.reduce((sum, tx) => sum + (tx.laba || 0), 0);
            }
        }
        
        const allUserStats = Object.values(userStats);

        // Urutkan berdasarkan setiap kategori
        const topByTransaction = [...allUserStats].sort((a, b) => b.transactionCount - a.transactionCount).slice(0, 10);
        const topByProfit = [...allUserStats].sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 10);
        const topBySaldo = [...allUserStats].sort((a, b) => b.totalSaldo - a.totalSaldo).slice(0, 10);

        // Simpan hasil ke satu node saja
        await db.ref('leaderboards/allTime').set({
            transactionCount: topByTransaction,
            totalProfit: topByProfit,
            totalSaldo: topBySaldo,
            lastCalculated: Date.now()
        });

        console.log("Semua leaderboard (All-Time) berhasil dihitung dan disimpan.");
        return { success: true };
    } catch (error) {
        console.error("Gagal menghitung leaderboard:", error);
        return { success: false, error };
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { type = 'transactionCount' } = req.query;
        const path = `leaderboards/allTime/${type}`;
        
        const leaderboardRef = db.ref(path);
        const snapshot = await leaderboardRef.once('value');

        if (!snapshot.exists()) {
            return res.status(200).json({ data: [] });
        }
        
        const data = snapshot.val();
        const dataAsArray = Array.isArray(data) ? data : Object.values(data);
        
        res.status(200).json({ data: dataAsArray });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data leaderboard." });
    }
};

export const triggerLeaderboardCalculation = async (req, res) => {
    const result = await calculateAndStoreLeaderboards();
    if (result.success) {
        res.status(200).json({ message: "Perhitungan leaderboard berhasil dipicu." });
    } else {
        res.status(500).json({ message: "Gagal memicu perhitungan leaderboard." });
    }
};