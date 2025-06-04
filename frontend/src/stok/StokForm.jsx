import React, { useState, useEffect } from 'react';
import { createStok, updateStok } from './stokService';
import { getAllSuppliers } from '../supplier/supplierService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import './StokForm.css';

const INPUT_MODE_NONE = ''; 
const INPUT_MODE_SELECT = 'select';
const INPUT_MODE_MANUAL = 'manual';

function StokForm({ onSuccess, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    namaBarang: '',
    jumlah: '',
    satuan: 'pcs',
    batasMinimum: '',
    supplier: '' 
  });
  
  const [supplierInputMode, setSupplierInputMode] = useState(INPUT_MODE_NONE); 
  const [selectedSupplierFromList, setSelectedSupplierFromList] = useState('');
  const [manualSupplierName, setManualSupplierName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = initialData !== null;
  const [daftarSupplier, setDaftarSupplier] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const response = await getAllSuppliers();
        setDaftarSupplier(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil daftar supplier:", error);
        showErrorToast("Gagal memuat daftar supplier. Input manual tetap tersedia.");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (isEditMode && initialData) {
      const initialSupplier = initialData.supplier || '';
      setFormData({
        namaBarang: initialData.namaBarang || '',
        jumlah: initialData.jumlah || '',
        satuan: initialData.satuan || 'pcs',
        batasMinimum: initialData.batasMinimum || '',
        supplier: initialSupplier 
      });
      
      if (initialSupplier) {
        const existingSupplier = daftarSupplier.find(s => s.namaSupplier === initialSupplier);
        if (existingSupplier && daftarSupplier.length > 0) {
          setSupplierInputMode(INPUT_MODE_SELECT);
          setSelectedSupplierFromList(initialSupplier);
          setManualSupplierName('');
        } else { 
          setSupplierInputMode(INPUT_MODE_MANUAL);
          setManualSupplierName(initialSupplier);
          setSelectedSupplierFromList('');
        }
      } else { 
        setSupplierInputMode(INPUT_MODE_NONE); // Atau INPUT_MODE_SELECT jika ingin default
        setSelectedSupplierFromList('');
        setManualSupplierName('');
      }
    } else { 
      setFormData({
        namaBarang: '',
        jumlah: '',
        satuan: 'pcs',
        batasMinimum: '',
        supplier: ''
      });
      setSupplierInputMode(INPUT_MODE_NONE); // Atau INPUT_MODE_SELECT
      setSelectedSupplierFromList('');
      setManualSupplierName('');
    }
  }, [initialData, isEditMode, daftarSupplier]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSupplierInputModeChange = (e) => {
    const mode = e.target.value;
    setSupplierInputMode(mode);
    
    if (mode === INPUT_MODE_SELECT) {
      setFormData(prev => ({ ...prev, supplier: selectedSupplierFromList }));
      setManualSupplierName(''); 
    } else if (mode === INPUT_MODE_MANUAL) {
      setFormData(prev => ({ ...prev, supplier: manualSupplierName }));
      setSelectedSupplierFromList(''); 
    } else {
      setFormData(prev => ({...prev, supplier: ''}));
      setSelectedSupplierFromList('');
      setManualSupplierName('');
    }
  };

  const handleSupplierListChange = (e) => {
    const value = e.target.value;
    setSelectedSupplierFromList(value);
    setFormData(prevData => ({ ...prevData, supplier: value }));
  };

  const handleManualSupplierChange = (e) => {
    const value = e.target.value;
    setManualSupplierName(value);
    if (supplierInputMode === INPUT_MODE_MANUAL) {
      setFormData(prevData => ({ ...prevData, supplier: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    let supplierToSubmit = '';
    if (supplierInputMode === INPUT_MODE_SELECT) {
        supplierToSubmit = selectedSupplierFromList;
    } else if (supplierInputMode === INPUT_MODE_MANUAL) {
        supplierToSubmit = manualSupplierName.trim();
    }
    
    const finalFormData = { ...formData, supplier: supplierToSubmit }; 

    try {
      let response;
      const dataToSend = { 
        namaBarang: finalFormData.namaBarang,
        jumlah: Number(finalFormData.jumlah),
        satuan: finalFormData.satuan,
        batasMinimum: Number(finalFormData.batasMinimum),
        supplier: finalFormData.supplier 
      };

      if (!dataToSend.namaBarang || formData.jumlah === '' || !dataToSend.satuan || formData.batasMinimum === '') {
        showErrorToast('Field Nama Barang, Jumlah, Satuan, dan Batas Minimum wajib diisi.');
        setIsSubmitting(false);
        return;
      }

      if (isEditMode) {
        response = await updateStok(initialData.id, dataToSend);
        showSuccessToast('Stok berhasil diperbarui!');
      } else {
        response = await createStok(dataToSend);
        showSuccessToast('Stok berhasil ditambahkan!');
      }
      onSuccess(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} stok.`;
      showErrorToast(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stok-form profesional">
      <div className="form-row">
        <div className="form-group-flex">
            <label htmlFor="namaBarang">Nama Barang</label>
            <input id="namaBarang" name="namaBarang" type="text" value={formData.namaBarang} onChange={handleInputChange} required />
        </div>
      </div>
      
      <div className="form-row two-columns">
        <div className="form-group-flex">
          <label htmlFor="jumlah">Jumlah</label>
          <input id="jumlah" name="jumlah" type="number" value={formData.jumlah} onChange={handleInputChange} required />
        </div>
        <div className="form-group-flex">
          <label htmlFor="satuan">Satuan</label>
          <input id="satuan" name="satuan" type="text" value={formData.satuan} onChange={handleInputChange} placeholder="pcs, kg, liter" required />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group-flex">
          <label htmlFor="batasMinimum">Batas Minimum Notifikasi</label>
          <input id="batasMinimum" name="batasMinimum" type="number" value={formData.batasMinimum} onChange={handleInputChange} placeholder="Contoh: 10" required />
        </div>
      </div>
      
      <div className="form-group-separator">
        <label>Informasi Supplier</label>
      </div>

      <div className="form-row">
        <div className="form-group-flex">
          <label htmlFor="supplierInputMode">Metode Input Supplier</label>
          <select 
            id="supplierInputMode" 
            name="supplierInputMode" 
            value={supplierInputMode} 
            onChange={handleSupplierInputModeChange}
            className="supplier-input-mode-select"
          >
            <option value={INPUT_MODE_NONE}>-- Pilih Metode --</option>
            <option value={INPUT_MODE_SELECT}>Pilih dari Daftar</option>
            <option value={INPUT_MODE_MANUAL}>Ketik Manual</option>
          </select>
        </div>
      </div>

      {supplierInputMode === INPUT_MODE_SELECT && (
        <div className="form-row">
          <div className="form-group-flex">
            <label htmlFor="selectedSupplierFromList">Pilih Supplier dari Daftar</label>
            <select 
              id="selectedSupplierFromList" 
              name="selectedSupplierFromList" 
              value={selectedSupplierFromList} 
              onChange={handleSupplierListChange}
              disabled={loadingSuppliers || daftarSupplier.length === 0}
              className="supplier-select-list"
            >
              <option value="">-- {loadingSuppliers ? "Memuat..." : (daftarSupplier.length === 0 ? "Belum ada supplier" : "Pilih Supplier")} --</option>
              {daftarSupplier.map(s => (
                <option key={s.id} value={s.namaSupplier}>{s.namaSupplier}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {supplierInputMode === INPUT_MODE_MANUAL && (
        <div className="form-row">
          <div className="form-group-flex">
            <label htmlFor="manualSupplierName">Nama Supplier (Manual)</label>
            <input 
              id="manualSupplierName" 
              name="manualSupplierName" 
              type="text" 
              value={manualSupplierName} 
              onChange={handleManualSupplierChange} 
              placeholder="Ketik nama supplier baru atau yang belum ada di daftar"
              required={supplierInputMode === INPUT_MODE_MANUAL} 
            />
          </div>
        </div>
      )}

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