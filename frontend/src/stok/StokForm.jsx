import React, { useState, useEffect } from 'react';
import { createStok, updateStok } from './stokService';
import './StokForm.css';

function StokForm({ onSuccess, onClose, initialData = null }) { 
  const [formData, setFormData] = useState({
    namaBarang: '',
    jumlah: '',
    satuan: 'pcs',
    batasMinimum: '',
    supplier: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        namaBarang: initialData.namaBarang || '',
        jumlah: initialData.jumlah || '',
        satuan: initialData.satuan || 'pcs',
        batasMinimum: initialData.batasMinimum || '',
        supplier: initialData.supplier || ''
      });
    } else {
      setFormData({
        namaBarang: '',
        jumlah: '',
        satuan: 'pcs',
        batasMinimum: '',
        supplier: ''
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let response;
      const dataToSend = { 
        namaBarang: formData.namaBarang,
        jumlah: Number(formData.jumlah),
        satuan: formData.satuan,
        batasMinimum: Number(formData.batasMinimum),
        supplier: formData.supplier
      };

      if (!dataToSend.namaBarang || dataToSend.jumlah === '' || !dataToSend.satuan || dataToSend.batasMinimum === '') {
        setError('Field Nama Barang, Jumlah, Satuan, dan Batas Minimum wajib diisi.');
        setIsSubmitting(false);
        return;
      }


      if (isEditMode) {
        response = await updateStok(initialData.id, dataToSend);
        alert('Stok berhasil diperbarui!');
      } else {
        response = await createStok(dataToSend);
        alert('Stok berhasil ditambahkan!');
      }
      onSuccess(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} stok.`;
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stok-form">
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-group">
        <label htmlFor="namaBarang">Nama Barang</label>
        <input id="namaBarang" name="namaBarang" type="text" value={formData.namaBarang} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label htmlFor="jumlah">Jumlah</label>
        <input id="jumlah" name="jumlah" type="number" value={formData.jumlah} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label htmlFor="batasMinimum">Batas Minimum Notifikasi</label>
        <input id="batasMinimum" name="batasMinimum" type="number" value={formData.batasMinimum} onChange={handleChange} placeholder="Contoh: 10" required />
      </div>
      
      <div className="form-group">
        <label htmlFor="satuan">Satuan</label>
        <input id="satuan" name="satuan" type="text" value={formData.satuan} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="supplier">Nama Supplier (Opsional)</label>
        <input 
          id="supplier" 
          name="supplier" 
          type="text" 
          value={formData.supplier} 
          onChange={handleChange} 
          placeholder="Contoh: PT Pemasok Jaya"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="button-cancel">Batal</button>
        <button type="submit" disabled={isSubmitting} className="button-submit">
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}

export default StokForm;