import db from '../config/firebase.js';

export const createListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, jumlahDitawarkan, hargaPerUnit, catatan } = req.body;
        if (!itemId || jumlahDitawarkan === undefined || hargaPerUnit === undefined) {
            return res.status(400).json({ message: 'Item, jumlah, dan harga wajib diisi.' });
        }
        
        const itemSnapshot = await db.ref(`stok/${userId}/${itemId}`).once('value');
        const profileSnapshot = await db.ref(`users/${userId}/profile`).once('value');
        if (!itemSnapshot.exists() || !profileSnapshot.exists()) {
            return res.status(404).json({ message: 'Item atau profil tidak ditemukan.' });
        }
        const itemData = itemSnapshot.val();
        const profileData = profileSnapshot.val();
        
        if (Number(jumlahDitawarkan) > Number(itemData.jumlah)) {
            return res.status(400).json({ message: 'Jumlah yang ditawarkan melebihi stok yang tersedia.' });
        }

        const newListingRef = db.ref('stockListings').push();
        const newListing = {
            id: newListingRef.key,
            userId,
            namaToko: profileData.namaToko,
            kontakWhatsApp: profileData.nomorWhatsAppNotifikasi,
            fotoProfilUrl: profileData.fotoProfilUrl || '',
            itemId,
            namaBarang: itemData.namaBarang,
            jumlahDitawarkan: Number(jumlahDitawarkan),
            satuan: itemData.satuan,
            hargaPerUnit: Number(hargaPerUnit),
            catatan: catatan || '',
            status: 'TERSEDIA',
            createdAt: Date.now(),
        };
        await newListingRef.set(newListing);
        res.status(201).json({ message: 'Barang berhasil dilisting di StockShare!', data: newListing });
    } catch (error) {
        console.error("Error di createListing:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const getAllListings = async (req, res) => {
    try {
        const listingsRef = db.ref('stockListings').orderByChild('status').equalTo('TERSEDIA');
        const snapshot = await listingsRef.once('value');
        if (!snapshot.exists()) {
            return res.status(200).json({ message: 'Belum ada stok yang dijual di StockShare.', data: [] });
        }
        const listings = snapshot.val();
        const listingsList = Object.values(listings).filter(listing => listing.userId !== req.user.id);
        res.status(200).json({ message: 'Data listing berhasil diambil', data: listingsList.reverse() });
    } catch (error) {
        console.error("Error di getAllListings:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const getMyListings = async (req, res) => {
    try {
        const userId = req.user.id;
        const listingsRef = db.ref('stockListings').orderByChild('userId').equalTo(userId);
        const snapshot = await listingsRef.once('value');
        if (!snapshot.exists()) {
            return res.status(200).json({ message: 'Anda belum memiliki listing barang.', data: [] });
        }
        const myListings = Object.values(snapshot.val());
        res.status(200).json({ message: 'Data listing Anda berhasil diambil', data: myListings.reverse() });
    } catch (error) {
        console.error("Error di getMyListings:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};

export const updateMyListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const { listingId } = req.params;
        const { jumlahDitawarkan, hargaPerUnit, catatan } = req.body;

        const listingRef = db.ref(`stockListings/${listingId}`);
        const snapshot = await listingRef.once('value');

        if (!snapshot.exists() || snapshot.val().userId !== userId) {
            return res.status(403).json({ message: 'Aksi tidak diizinkan.' });
        }

        const existingData = snapshot.val();
        
        const updateData = {
            ...existingData,
            jumlahDitawarkan: Number(jumlahDitawarkan),
            hargaPerUnit: Number(hargaPerUnit),
            catatan: catatan || '',
            updatedAt: Date.now()
        };

        await listingRef.update(updateData);
        const updatedSnapshot = await listingRef.once('value');
        res.status(200).json({ message: 'Listing berhasil diperbarui.', data: updatedSnapshot.val() });
    } catch (error) {
        console.error("Error di updateMyListing:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

export const deleteMyListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const { listingId } = req.params;
        const listingRef = db.ref(`stockListings/${listingId}`);
        const snapshot = await listingRef.once('value');
        if (!snapshot.exists() || snapshot.val().userId !== userId) {
            return res.status(403).json({ message: 'Aksi tidak diizinkan.' });
        }
        await listingRef.remove();
        res.status(200).json({ message: 'Listing berhasil dihapus.' });
    } catch (error) {
        console.error("Error di deleteMyListing:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};
