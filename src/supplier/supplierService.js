import api from '../services/api.js';

export const createSupplier = (supplierData) => {
    return api.post('/suppliers', supplierData);
};

export const getAllSuppliers = () => {
    return api.get('/suppliers');
};

export const updateSupplier = (supplierId, supplierData) => {
    return api.put(`/suppliers/${supplierId}`, supplierData);
};

export const deleteSupplier = (supplierId) => {
    return api.delete(`/suppliers/${supplierId}`);
};

export const deleteAllSuppliers = async (password) => {
  return api.delete('/suppliers/all', { 
    data: { password } 
  });
};