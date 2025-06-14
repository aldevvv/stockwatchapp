import api from '../services/api.js';

export const createTransaksi = (transaksiData) => {
    return api.post('/penjualan', transaksiData);
};

export const getAllTransaksi = () => {
    return api.get('/penjualan');
};

export const getLaporanPenjualan = (params) => {
    return api.get('/penjualan/laporan', { params });
};