import db from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

export const createTransaksi = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, totalPenjualan, totalModal, laba, catatan } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0 || totalPenjualan === undefined || totalModal === undefined || laba === undefined) {
            return res.status(400).send({ message: "Data transaksi tidak lengkap." });
        }
        const transaksiId = uuidv4();
        const newTransaksi = {
            id: transaksiId,
            tanggal: Date.now(),
            items,
            totalPenjualan: Number(totalPenjualan),
            totalModal: Number(totalModal),
            laba: Number(laba),
            catatan: catatan || ''
        };
        await db.ref(`penjualan/${userId}/${transaksiId}`).set(newTransaksi);
        res.status(201).send({ message: "Transaksi berhasil dicatat.", data: newTransaksi });
    } catch (error) {
        res.status(500).send({ message: "Gagal mencatat transaksi.", error: error.message });
    }
};

export const getAllTransaksi = async (req, res) => {
    try {
        const userId = req.user.id;
        const snapshot = await db.ref(`penjualan/${userId}`).orderByChild('tanggal').once('value');
        const transaksi = snapshot.val();
        if (transaksi) {
            const transaksiList = Object.values(transaksi).reverse();
            res.status(200).send({ message: "Data transaksi berhasil diambil.", data: transaksiList });
        } else {
            res.status(200).send({ message: "Belum ada transaksi yang tercatat.", data: [] });
        }
    } catch (error) {
        res.status(500).send({ message: "Gagal mengambil data transaksi.", error: error.message });
    }
};

export const getLaporanPenjualan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).send({ message: "Rentang tanggal wajib diisi." });
        }
        const transaksiRef = db.ref(`penjualan/${userId}`);
        const snapshot = await transaksiRef.orderByChild('tanggal')
                                          .startAt(new Date(startDate).getTime())
                                          .endAt(new Date(endDate).setHours(23, 59, 59, 999))
                                          .once('value');
        
        const transaksiData = snapshot.val();
        const defaultResponse = {
            kpi: { totalPenjualan: 0, totalLaba: 0, jumlahTransaksi: 0, rataRataTransaksi: 0 },
            trenPerJam: Array(24).fill(0),
            produkTerlaris: [],
            riwayatTransaksi: []
        };
        if (!transaksiData) {
            return res.status(200).send({ message: "Tidak ada data transaksi pada periode ini.", data: defaultResponse});
        }
        const transaksiList = Object.values(transaksiData);
        let totalPenjualan = 0;
        let totalLaba = 0;
        const produkSales = {};
        const salesByHour = Array(24).fill(0);

        transaksiList.forEach(tx => {
            totalPenjualan += tx.totalPenjualan;
            totalLaba += tx.laba;
            const hour = new Date(tx.tanggal).getHours();
            salesByHour[hour] += tx.totalPenjualan;
            tx.items.forEach(item => {
                if (!produkSales[item.produkId]) {
                    produkSales[item.produkId] = { namaProduk: item.namaProduk, terjual: 0, omzet: 0 };
                }
                produkSales[item.produkId].terjual += item.qty;
                produkSales[item.produkId].omzet += (item.qty * item.hargaJual);
            });
        });
        const produkTerlaris = Object.values(produkSales).sort((a, b) => b.terjual - a.terjual).slice(0, 5);
        const laporan = {
            kpi: {
                totalPenjualan,
                totalLaba,
                jumlahTransaksi: transaksiList.length,
                rataRataTransaksi: transaksiList.length > 0 ? totalPenjualan / transaksiList.length : 0,
            },
            trenPerJam: salesByHour,
            produkTerlaris,
            riwayatTransaksi: transaksiList.sort((a, b) => b.tanggal - a.tanggal)
        };
        res.status(200).send({ message: "Laporan penjualan berhasil dibuat.", data: laporan });
    } catch (error) {
        res.status(500).send({ message: "Gagal membuat laporan penjualan.", error: error.message });
    }
};