// frontend/src/supplier/supplierService.js
import api from '../services/api.js'; // Instance axios terpusat kita

export const getAllSuppliers = () => {
  return api.get('/suppliers');
};

export const createSupplier = (supplierData) => {
  return api.post('/suppliers', supplierData);
};

export const updateSupplier = (supplierId, supplierData) => {
  return api.put(`/suppliers/${supplierId}`, supplierData);
};

export const deleteSupplier = (supplierId) => {
  return api.delete(`/suppliers/${supplierId}`);
};