import React, { useState, useEffect } from 'react';
import { createListing, updateMyListing } from './stockshareService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import './ListStokForm.css';

function ListStokForm({ itemToSell, onSuccess, onClose, isEditMode = false, initialListingData = null }) {
  const [formData, setFormData] = useState({
    jumlahDitawarkan: '',
    hargaPerUnit: '',
    catatan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && initialListingData) {
      setFormData({
        jumlahDitawarkan: initialListingData.jumlahDitawarkan || '',
        hargaPerUnit: initialListingData.hargaPerUnit || '',
        catatan: initialListingData.catatan || ''
      });
    }
  }, [initialListingData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateMyListing(initialListingData.id, formData);
        showSuccessToast('Listing berhasil diperbarui!');
      } else {
        const listingData = { itemId: itemToSell.id, ...formData };
        await createListing(listingData);
        showSuccessToast(`"${itemToSell.namaBarang}" berhasil dilisting di StockShare!`);
      }
      onSuccess();
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Gagal menyimpan perubahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayData = isEditMode ? initialListingData : itemToSell;

  return (
    <form onSubmit={handleSubmit} className="list-stok-form">
      <div className="item-to-sell-info">
        <span className="info-label">{isEditMode ? "Mengedit Listing" : "Menawarkan Barang"}</span>
        <strong className="info-item-name">{displayData?.namaBarang}</strong>
        {!isEditMode && <small>Stok Tersedia : {displayData?.jumlah} {displayData?.satuan}</small>}
      </div>

      <div className="form-row-list">
        <div className="form-group-list">
            <label htmlFor="jumlahDitawarkan">Jumlah yang Ditawarkan</label>
            <input type="number" id="jumlahDitawarkan" name="jumlahDitawarkan" value={formData.jumlahDitawarkan} onChange={handleChange} required />
        </div>
        <div className="form-group-list">
            <label htmlFor="hargaPerUnit">Harga Jual / {displayData?.satuan}</label>
            <input type="number" id="hargaPerUnit" name="hargaPerUnit" value={formData.hargaPerUnit} onChange={handleChange} required />
        </div>
      </div>
      
       <div className="form-group-list">
          <label htmlFor="catatan">Catatan (Opsional)</label>
          <textarea id="catatan" name="catatan" rows="3" value={formData.catatan} onChange={handleChange}></textarea>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="button-cancel">Batal</button>
        <button type="submit" disabled={isSubmitting} className="button-submit">
          {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Jual di StockShare')}
        </button>
      </div>
    </form>
  );
}

export default ListStokForm;