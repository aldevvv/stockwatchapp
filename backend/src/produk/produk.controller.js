import db from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

export const createProduk = async (req, res) => {
    try {
        const userId = req.user.id;
        const { namaProduk, hargaJual, hargaModal } = req.body;
        if (!namaProduk || hargaJual === undefined || hargaModal === undefined) {
            return res.status(400).send({ message: "Nama produk, harga jual, dan harga modal wajib diisi." });
        }
        
        const produkId = uuidv4();
        const newProduk = {
            id: produkId,
            namaProduk,
            hargaJual: Number(hargaJual),
            hargaModal: Number(hargaModal),
            createdAt: Date.now()
        };

        await db.ref(`produkJadi/${userId}/${produkId}`).set(newProduk);
        res.status(201).send({ message: "Produk berhasil dibuat.", data: newProduk });
    } catch (error) {
        res.status(500).send({ message: "Gagal membuat produk.", error: error.message });
    }
};

export const getAllProduk = async (req, res) => {
    try {
        const userId = req.user.id;
        const snapshot = await db.ref(`produkJadi/${userId}`).orderByChild('namaProduk').once('value');
        const produk = snapshot.val();
        if (produk) {
            res.status(200).send({ message: "Data produk berhasil diambil.", data: Object.values(produk) });
        } else {
            res.status(200).send({ message: "Belum ada produk jadi yang ditambahkan.", data: [] });
        }
    } catch (error) {
        res.status(500).send({ message: "Gagal mengambil data produk.", error: error.message });
    }
};

export const updateProduk = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { namaProduk, hargaJual, hargaModal } = req.body;
        if (!namaProduk || hargaJual === undefined || hargaModal === undefined) {
            return res.status(400).send({ message: "Data pembaruan produk tidak lengkap." });
        }
        const produkRef = db.ref(`produkJadi/${userId}/${id}`);
        const snapshot = await produkRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).send({ message: "Produk tidak ditemukan." });
        }
        const currentData = snapshot.val();
        const updatedProduk = { ...currentData, namaProduk, hargaJual: Number(hargaJual), hargaModal: Number(hargaModal), updatedAt: Date.now() };
        await produkRef.update(updatedProduk);
        res.status(200).send({ message: "Produk berhasil diperbarui.", data: updatedProduk });
    } catch (error) {
        res.status(500).send({ message: "Gagal memperbarui produk.", error: error.message });
    }
};

export const deleteProduk = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const produkRef = db.ref(`produkJadi/${userId}/${id}`);
        await produkRef.remove();
        res.status(200).send({ message: "Produk berhasil dihapus." });
    } catch (error) {
        res.status(500).send({ message: "Gagal menghapus produk.", error: error.message });
    }
};
