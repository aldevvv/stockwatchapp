import db from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const createSupplier = async (req, res) => {
    try {
        const userId = req.user.id;
        const { namaSupplier, barangDisuplai, nomorTelepon, emailSupplier, alamatSupplier, hargaBarangDariSupplier } = req.body;
        if (!namaSupplier) {
            return res.status(400).json({ message: 'Nama Supplier tidak boleh kosong.' });
        }
        const supplierId = uuidv4();
        const newSupplier = { id: supplierId, namaSupplier, barangDisuplai: barangDisuplai || '', nomorTelepon: nomorTelepon || '', emailSupplier: emailSupplier || '', alamatSupplier: alamatSupplier || '', hargaBarangDariSupplier: hargaBarangDariSupplier || '', createdAt: Date.now() };
        await db.ref(`suppliers/${userId}/${supplierId}`).set(newSupplier);
        res.status(201).json({ message: 'Supplier berhasil ditambahkan', data: newSupplier });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const getAllSuppliers = async (req, res) => {
    try {
        const userId = req.user.id;
        const suppliersRef = db.ref(`suppliers/${userId}`);
        const snapshot = await suppliersRef.orderByChild('namaSupplier').once('value');
        if (!snapshot.exists()) {
            return res.status(200).json({ message: 'Belum ada data supplier.', data: [] });
        }
        const suppliersList = [];
        snapshot.forEach(childSnapshot => {
            suppliersList.push(childSnapshot.val());
        });
        res.status(200).json({ message: 'Data supplier berhasil diambil', data: suppliersList });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const updateSupplier = async (req, res) => {
    try {
        const userId = req.user.id;
        const { supplierId } = req.params;
        const { namaSupplier } = req.body;
        if (!supplierId || !namaSupplier) {
            return res.status(400).json({ message: 'ID dan Nama Supplier dibutuhkan.' });
        }
        const supplierRef = db.ref(`suppliers/${userId}/${supplierId}`);
        const snapshot = await supplierRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'Supplier tidak ditemukan.' });
        }
        const updatedData = { ...snapshot.val(), ...req.body, updatedAt: Date.now() };
        await supplierRef.update(updatedData);
        res.status(200).json({ message: 'Supplier berhasil diperbarui', data: updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const deleteSupplier = async (req, res) => {
    try {
        const userId = req.user.id;
        const { supplierId } = req.params;
        if (!supplierId) {
            return res.status(400).json({ message: 'ID Supplier dibutuhkan.' });
        }
        const supplierRef = db.ref(`suppliers/${userId}/${supplierId}`);
        await supplierRef.remove();
        res.status(200).json({ message: 'Supplier berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const deleteAllSuppliers = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        if (!password) {
            return res.status(400).json({ message: 'Password dibutuhkan.' });
        }
        const userCredentialsRef = db.ref(`users/${userId}/credentials`);
        const snapshot = await userCredentialsRef.once('value');
        const credentials = snapshot.val();
        if (!credentials || !credentials.password) {
            return res.status(500).json({ message: 'Tidak dapat memverifikasi pengguna.' });
        }
        const isMatch = await bcrypt.compare(password, credentials.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah.' });
        }
        await db.ref(`suppliers/${userId}`).remove();
        res.status(200).json({ message: 'Semua data supplier berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Error server.', error: error.message });
    }
};