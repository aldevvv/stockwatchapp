import React, { useState, useEffect } from 'react';
import './ProdukForm.css';

function ProdukForm({ onSuccess, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    namaProduk: '',
    hargaJual: '',
    hargaModal: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        namaProduk: initialData.namaProduk || '',
        hargaJual: initialData.hargaJual || '',
        hargaModal: initialData.hargaModal || '',
      });
    }
  }, [isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaProduk || !formData.hargaJual || !formData.hargaModal) {
        showErrorToast('Semua field wajib diisi.');
        return;
    }
    setIsSubmitting(true);
    onSuccess(formData, isEditMode, initialData?.id);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="produk-form">
      <div className="form-group">
        <label htmlFor="namaProduk">Nama Produk Jadi*</label>
        <input type="text" id="namaProduk" name="namaProduk" value={formData.namaProduk} onChange={handleChange} required placeholder="Contoh: Kopi Susu Gula Aren"/>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="hargaModal">Harga Modal / HPP (Rp)*</label>
          <input type="number" id="hargaModal" name="hargaModal" value={formData.hargaModal} onChange={handleChange} required placeholder="Contoh: 8000"/>
        </div>
        <div className="form-group">
          <label htmlFor="hargaJual">Harga Jual (Rp)*</label>
          <input type="number" id="hargaJual" name="hargaJual" value={formData.hargaJual} onChange={handleChange} required placeholder="Contoh: 18000"/>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onClose} className="button-cancel">Batal</button>
        <button type="submit" disabled={isSubmitting} className="button-submit">
          {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Produk')}
        </button>
      </div>
    </form>
  );
}

export default ProdukForm;