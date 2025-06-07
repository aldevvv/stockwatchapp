import db from '../config/firebase.js';
import bcrypt from 'bcryptjs';

export const createSupplier = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            namaSupplier, 
            barangDisuplai, 
            nomorTelepon, 
            emailSupplier, 
            alamatSupplier, 
            hargaBarangDariSupplier
        } = req.body;

        if (!namaSupplier) {
            return res.status(400).json({ message: 'Nama Supplier tidak boleh kosong.' });
        }

        const newSupplierRef = db.ref(`users/${userId}/suppliers`).push();
        const supplierId = newSupplierRef.key;

        const newSupplier = {
            id: supplierId,
            namaSupplier,
            barangDisuplai: barangDisuplai || '',
            nomorTelepon: nomorTelepon || '',
            emailSupplier: emailSupplier || '',
            alamatSupplier: alamatSupplier || '',
            hargaBarangDariSupplier: hargaBarangDariSupplier || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await newSupplierRef.set(newSupplier);
        res.status(201).json({ message: 'Supplier berhasil ditambahkan', data: newSupplier });
    } catch (error) {
        console.error("Error di createSupplier:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const getAllSuppliers = async (req, res) => {
    try {
        const userId = req.user.id;
        const suppliersRef = db.ref(`users/${userId}/suppliers`);
        const snapshot = await suppliersRef.once('value');

        if (!snapshot.exists()) {
            return res.status(200).json({ message: 'Belum ada data supplier.', data: [] });
        }
        
        const suppliersList = [];
        snapshot.forEach(childSnapshot => {
            suppliersList.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        
        suppliersList.sort((a, b) => a.namaSupplier.localeCompare(b.namaSupplier));

        res.status(200).json({ message: 'Data supplier berhasil diambil', data: suppliersList });
    } catch (error) {
        console.error("Error di getAllSuppliers:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export const updateSupplier = async (req, res) => {
    try {
        const userId = req.user.id;
        const { supplierId } = req.params;
        const { 
            namaSupplier, 
            barangDisuplai, 
            nomorTelepon, 
            emailSupplier, 
            alamatSupplier, 
            hargaBarangDariSupplier
        } = req.body;

        if (!supplierId) {
            return res.status(400).json({ message: 'ID Supplier dibutuhkan.' });
        }
        if (!namaSupplier) {
            return res.status(400).json({ message: 'Nama Supplier tidak boleh kosong.' });
        }

        const supplierRef = db.ref(`users/${userId}/suppliers/${supplierId}`);
        const snapshot = await supplierRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'Supplier tidak ditemukan.' });
        }

        const currentData = snapshot.val();
        const updatedData = {
            namaSupplier,
            barangDisuplai: barangDisuplai !== undefined ? barangDisuplai : currentData.barangDisuplai || '',
            nomorTelepon: nomorTelepon !== undefined ? nomorTelepon : currentData.nomorTelepon || '',
            emailSupplier: emailSupplier !== undefined ? emailSupplier : currentData.emailSupplier || '',
            alamatSupplier: alamatSupplier !== undefined ? alamatSupplier : currentData.alamatSupplier || '',
            hargaBarangDariSupplier: hargaBarangDariSupplier !== undefined ? hargaBarangDariSupplier : currentData.hargaBarangDariSupplier || '',
            updatedAt: new Date().toISOString(),
            createdAt: currentData.createdAt || new Date().toISOString(),
            id: supplierId,
        };

        await supplierRef.update(updatedData);
        res.status(200).json({ message: 'Supplier berhasil diperbarui', data: updatedData });
    } catch (error) {
        console.error("Error di updateSupplier:", error);
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
            return res.status(401).json({ message: 'Password salah. Aksi dibatalkan.' });
        }
        await db.ref(`users/${userId}/suppliers`).remove();
        res.status(200).json({ message: 'Semua data supplier berhasil dihapus.' });
    } catch (error) {
        console.error("Error di deleteAllSuppliers:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const deleteSupplier = async (req, res) => {
    try {
        const userId = req.user.id;
        const { supplierId } = req.params;

        if (!supplierId) {
            return res.status(400).json({ message: 'ID Supplier dibutuhkan.' });
        }

        const supplierRef = db.ref(`users/${userId}/suppliers/${supplierId}`);
        const snapshot = await supplierRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'Supplier tidak ditemukan.' });
        }

        await supplierRef.remove();
        res.status(200).json({ message: 'Supplier berhasil dihapus.' });
    } catch (error) {
        console.error("Error di deleteSupplier:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};