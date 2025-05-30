import React, { useState, useEffect } from 'react';
import { createStok, updateStok } from './stokService';
import './StokForm.css';

/**
 * Komponen form untuk menambah atau mengedit data stok.
 * @param {function} onSuccess - Callback function yang dijalankan setelah submit berhasil.
 * @param {function} onClose - Callback function untuk menutup modal.
 * @param {object|null} initialData - Data awal untuk form, jika null berarti mode 'Tambah', jika ada data berarti mode 'Edit'.
 */
function StokForm({ onSuccess, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    namaBarang: '',
    jumlah: '',
    satuan: 'pcs',
    batasMinimum: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Menentukan apakah form ini dalam mode 'Edit' berdasarkan props initialData
  const isEditMode = initialData !== null;

  // useEffect ini akan berjalan setiap kali `initialData` berubah.
  // Gunanya untuk mengisi form secara otomatis saat mode 'Edit'.
  useEffect(() => {
    if (isEditMode) {
      // Mengisi form dengan data yang ada, beri nilai default jika ada field yang kosong
      setFormData({
        namaBarang: initialData.namaBarang || '',
        jumlah: initialData.jumlah || '',
        satuan: initialData.satuan || 'pcs',
        batasMinimum: initialData.batasMinimum || '',
      });
    } else {
      // Reset form jika mode 'Tambah'
      setFormData({
        namaBarang: '',
        jumlah: '',
        satuan: 'pcs',
        batasMinimum: '',
      });
    }
  }, [initialData, isEditMode]);

  // Handler untuk setiap perubahan pada input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handler saat form disubmit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let response;
      const dataToSend = { 
        ...formData, 
        jumlah: Number(formData.jumlah),
        batasMinimum: Number(formData.batasMinimum)
      };

      if (isEditMode) {
        // Panggil service update jika mode 'Edit'
        response = await updateStok(initialData.id, dataToSend);
        alert('Stok berhasil diperbarui!');
      } else {
        // Panggil service create jika mode 'Tambah'
        response = await createStok(dataToSend);
        alert('Stok berhasil ditambahkan!');
      }

      // Panggil callback onSuccess dan kirim data yang baru/terupdate ke parent component (DashboardPage)
      onSuccess(response.data.data);

    } catch (err) {
      const errorMessage = `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} stok.`;
      setError(errorMessage);
      console.error(err);
      alert(errorMessage);
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