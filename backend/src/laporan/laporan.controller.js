import db from '../config/firebase.js';

export const getRiwayatStokByItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    let { tanggalMulai, tanggalSelesai, halaman, batas } = req.query;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID wajib diisi.' });
    }

    const currentPage = parseInt(halaman) || 1;
    const limitPerPage = parseInt(batas) || 10;

    let riwayatItemRef = db.ref(`riwayatStok/${userId}/${itemId}`);
    let query = riwayatItemRef.orderByChild('timestamp');

    if (tanggalMulai) {
      try {
        query = query.startAt(new Date(tanggalMulai).toISOString());
      } catch (e) {
        return res.status(400).json({ message: 'Format tanggalMulai tidak valid.' });
      }
    }
    if (tanggalSelesai) {
      try {
        const akhirHari = new Date(tanggalSelesai);
        akhirHari.setHours(23, 59, 59, 999);
        query = query.endAt(akhirHari.toISOString());
      } catch (e) {
        return res.status(400).json({ message: 'Format tanggalSelesai tidak valid.' });
      }
    }
    
    const snapshot = await query.once('value');
    const dataRiwayat = snapshot.val();
    let allMatchingDataList = dataRiwayat ? Object.values(dataRiwayat) : [];
    
    allMatchingDataList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalItem = allMatchingDataList.length;
    const totalHalaman = Math.ceil(totalItem / limitPerPage);
    const startIndex = (currentPage - 1) * limitPerPage;
    const endIndex = startIndex + limitPerPage;
    const paginatedData = allMatchingDataList.slice(startIndex, endIndex);

    console.log(`Mengambil riwayat untuk item: ${itemId}, Filter: [Mulai: ${tanggalMulai}, Selesai: ${tanggalSelesai}], Halaman: ${currentPage}, Batas: ${limitPerPage}, Total Item Cocok: ${totalItem}`);

    res.status(200).json({
      message: `Riwayat stok untuk item ${itemId} berhasil diambil`,
      data: paginatedData,
      pagination: {
        halamanSaatIni: currentPage,
        totalHalaman: totalHalaman,
        itemPerHalaman: limitPerPage,
        totalItem: totalItem,
      }
    });

  } catch (error) {
    console.error("Error di getRiwayatStokByItem (dengan paginasi):", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};