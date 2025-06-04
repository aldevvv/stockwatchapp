import api from '../services/api.js';

export const getRiwayatStokByItem = (itemId, tanggalMulai, tanggalSelesai, halaman, batas) => {
  if (!itemId) {
    return Promise.reject(new Error('Item ID tidak boleh kosong untuk mengambil riwayat.'));
  }

  const params = {};
  if (tanggalMulai) {
    params.tanggalMulai = tanggalMulai;
  }
  if (tanggalSelesai) {
    params.tanggalSelesai = tanggalSelesai;
  }
  if (halaman) {
    params.halaman = halaman;
  }
  if (batas) {
    params.batas = batas;
  }

  return api.get(`/laporan/stok/${itemId}/riwayat`, { params });
};