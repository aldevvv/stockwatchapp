import api from '../services/api.js';

export const createProduk = (produkData) => {
    return api.post('/produk', produkData);
};

export const getAllProduk = () => {
    return api.get('/produk');
};

export const updateProduk = (id, produkData) => {
    return api.put(`/produk/${id}`, produkData);
};

export const deleteProduk = (id) => {
    return api.delete(`/produk/${id}`);
};