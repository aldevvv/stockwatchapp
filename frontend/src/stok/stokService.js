import api from '../services/api.js';

export const getAllStok = () => {
  return api.get('/stok');
};

// FUNGSI BARU UNTUK MENAMBAH STOK
export const createStok = (stokData) => {
  // stokData adalah objek { namaBarang, jumlah, satuan }
  return api.post('/stok', stokData);
};

// ... (fungsi getAllStok dan createStok sudah ada)

// FUNGSI BARU UNTUK UPDATE
export const updateStok = (id, stokData) => {
  return api.put(`/stok/${id}`, stokData);
};

// FUNGSI BARU UNTUK DELETE
export const deleteStok = (id) => {
  return api.delete(`/stok/${id}`);
};