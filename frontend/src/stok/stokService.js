import api from '../services/api.js';

export const createStok = (stokData) => {
  return api.post('/stok', stokData);
};

export const getAllStok = () => {
  return api.get('/stok');
};

export const updateJumlahStokService = (itemId, dataJumlah) => {
  return api.put(`/stok/${itemId}/jumlah`, dataJumlah);
};

export const updateDetailStokItemService = (itemId, dataDetail) => {
  return api.put(`/stok/${itemId}/detail`, dataDetail);
};

export const deleteStok = (itemId) => {
  return api.delete(`/stok/${itemId}`);
};