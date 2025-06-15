import api from '../services/api.js';

export const createStok = (stokData) => {
  return api.post('/stok', stokData);
};

export const getAllStok = () => {
  return api.get('/stok');
};

export const updateStok = (itemId, dataToUpdate) => {
    return api.put(`/stok/${itemId}`, dataToUpdate);
};

export const deleteStok = (itemId) => {
  return api.delete(`/stok/${itemId}`);
};

export const deleteAllStok = async (password) => {
  return api.delete('/stok/all', { 
    data: { password } 
  });
};