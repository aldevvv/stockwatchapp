import db from '../config/firebase.js';

export const createListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, jumlahDitawarkan, hargaPerUnit, catatan } = req.body;

        if (!itemId || jumlahDitawarkan === undefined || hargaPerUnit === undefined) {
            return res.status(400).json({ message: 'Item, jumlah, dan harga wajib diisi.' });
        }

        const itemSnapshot = await db.ref(`users/<span class="math-inline">\{userId\}/stok/</span>{itemId}`).once('value');
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
            itemId,
            namaBarang: itemData.namaBarang,
            jumlahDitawarkan: Number(jumlahDitawarkan),
            satuan: itemData.satuan,
            hargaPerUnit: Number(hargaPerUnit),
            catatan: catatan || '',
            status: 'TERSEDIA',
            createdAt: new Date().toISOString(),
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
        const listingsList = Object.values(listings);

        const filteredListings = listingsList.filter(listing => listing.userId !== req.user.id);

        res.status(200).json({ message: 'Data listing berhasil diambil', data: filteredListings.reverse() });
    } catch (error) {
        console.error("Error di getAllListings:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
};