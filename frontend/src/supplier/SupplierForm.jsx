import React, { useState, useEffect } from 'react';
import { createSupplier, updateSupplier } from './supplierService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import './SupplierForm.css';

function SupplierForm({ onSuccess, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    namaSupplier: '',
    barangDisuplai: '',
    nomorTelepon: '',
    emailSupplier: '',
    alamatSupplier: '',
    hargaBarangDariSupplier: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        namaSupplier: initialData.namaSupplier || '',
        barangDisuplai: initialData.barangDisuplai || '',
        nomorTelepon: initialData.nomorTelepon || '',
        emailSupplier: initialData.emailSupplier || '',
        alamatSupplier: initialData.alamatSupplier || '',
        hargaBarangDariSupplier: initialData.hargaBarangDariSupplier || '',
      });
    } else {
      setFormData({
        namaSupplier: '',
        barangDisuplai: '',
        nomorTelepon: '',
        emailSupplier: '',
        alamatSupplier: '',
        hargaBarangDariSupplier: '',
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaSupplier) {
      showErrorToast('Nama Supplier wajib diisi.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateSupplier(initialData.id, formData);
        showSuccessToast('Supplier berhasil diperbarui!');
      } else {
        await createSupplier(formData);
        showSuccessToast('Supplier berhasil ditambahkan!');
      }
      onSuccess();
    } catch (err) {
      console.error("Error saat menyimpan supplier:", err);
      showErrorToast(err.response?.data?.message || 'Gagal menyimpan data supplier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="supplier-form-container">
      <div className="form-row">
        <div className="form-group-flex">
            <label htmlFor="namaSupplier">Nama Supplier</label>
            <input type="text" id="namaSupplier" name="namaSupplier" value={formData.namaSupplier} onChange={handleChange} required />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group-flex">
            <label htmlFor="barangDisuplai">Barang yang Disuplai</label>
            <input type="text" id="barangDisuplai" name="barangDisuplai" value={formData.barangDisuplai} onChange={handleChange} placeholder="Contoh: Kopi, Gula, Susu"/>
        </div>
      </div>
      
      <div className="form-row two-columns">
        <div className="form-group-flex">
          <label htmlFor="nomorTelepon">Nomor Telepon</label>
          <input type="text" id="nomorTelepon" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} placeholder="Contoh: 08123456789"/>
        </div>
        <div className="form-group-flex">
          <label htmlFor="emailSupplier">Email Supplier</label>
          <input type="email" id="emailSupplier" name="emailSupplier" value={formData.emailSupplier} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group-flex">
            <label htmlFor="alamatSupplier">Alamat Supplier</label>
            <input type="text" id="alamatSupplier" name="alamatSupplier" value={formData.alamatSupplier} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group-flex">
            <label htmlFor="hargaBarangDariSupplier">Info Harga dari Supplier</label>
            <input type="text" id="hargaBarangDariSupplier" name="hargaBarangDariSupplier" value={formData.hargaBarangDariSupplier} onChange={handleChange} placeholder="Contoh: Kopi Rp 50rb/kg"/>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onClose} className="button-cancel">Batal</button>
        <button type="submit" disabled={isSubmitting} className="button-submit">
          {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah Supplier')}
        </button>
      </div>
    </form>
  );
}

export default SupplierForm;