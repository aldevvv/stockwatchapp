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
  }, [isEditMode, initialListingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jumlahDitawarkanNum = Number(formData.jumlahDitawarkan);
    const hargaPerUnitNum = Number(formData.hargaPerUnit);

    if (!formData.jumlahDitawarkan || !formData.hargaPerUnit) {
      showErrorToast("Jumlah dan Harga per Unit wajib diisi.");
      return;
    }
    if (jumlahDitawarkanNum <= 0 || hargaPerUnitNum < 0) {
      showErrorToast("Jumlah dan Harga harus angka positif.");
      return;
    }
    
    const stokTersedia = isEditMode ? (initialListingData.stokTersedia || jumlahDitawarkanNum) : itemToSell.jumlah;
    if (jumlahDitawarkanNum > Number(stokTersedia)) {
      showErrorToast(`Jumlah yang ditawarkan (${jumlahDitawarkanNum}) tidak boleh melebihi stok yang tersedia (${stokTersedia}).`);
      return;
    }

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
      console.error("Gagal menyimpan listing:", err);
      showErrorToast(err.response?.data?.message || "Gagal menyimpan listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="list-stok-form profesional">
      {!isEditMode && itemToSell && (
        <div className="item-info-header">
            <span className="info-header-label">Menawarkan Barang</span>
            <span className="info-header-value">{itemToSell.namaBarang}</span>
            <span className="info-header-subtext">Stok Tersedia: {itemToSell.jumlah} {itemToSell.satuan}</span>
        </div>
      )}
       {isEditMode && initialListingData && (
        <div className="item-info-header">
            <span className="info-header-label">Mengedit Listing</span>
            <span className="info-header-value">{initialListingData.namaBarang}</span>
        </div>
      )}

      <div className="form-row two-columns">
        <div className="form-group-flex">
          <label htmlFor="jumlahDitawarkan">Jumlah Ditawarkan*</label>
          <input 
            type="number" 
            id="jumlahDitawarkan" 
            name="jumlahDitawarkan" 
            value={formData.jumlahDitawarkan} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group-flex">
          <label htmlFor="hargaPerUnit">Harga Jual per {isEditMode ? initialListingData.satuan : itemToSell.satuan}*</label>
          <input 
            type="number" 
            id="hargaPerUnit" 
            name="hargaPerUnit"
            step="1" 
            value={formData.hargaPerUnit} 
            onChange={handleChange} 
            placeholder="Contoh: 55000"
            required 
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group-flex">
          <label htmlFor="catatan">Catatan</label>
          <textarea 
            id="catatan" 
            name="catatan" 
            rows="3" 
            value={formData.catatan} 
            onChange={handleChange}
            placeholder="Contoh: Kondisi baru, nego tipis, kadaluwarsa 1 tahun lagi, dll."
          ></textarea>
        </div>
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