import React, { useState, useEffect } from 'react';
import { updateStok, createStok } from './stokService';
import { getAllSuppliers } from '../supplier/supplierService';
import { unitOptions } from '../utils/unitOptions';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import './StokForm.css';

function StokForm({ onSuccess, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    namaBarang: '',
    jumlah: '',
    satuan: 'pcs',
    batasMinimum: '',
    supplier: '',
    hargaBeliSatuan: '',
    keterangan: ''
  });
  
  const [initialJumlah, setInitialJumlah] = useState(0);
  
  const [supplierInputMode, setSupplierInputMode] = useState('');
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
        showErrorToast("Gagal memuat daftar supplier.");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (isEditMode && initialData) {
      const initialSupplierValue = initialData.supplier || '';
      setFormData({
        namaBarang: initialData.namaBarang || '',
        jumlah: initialData.jumlah || '',
        satuan: initialData.satuan || 'pcs',
        batasMinimum: initialData.batasMinimum || '',
        supplier: initialSupplierValue,
        hargaBeliSatuan: '',
        keterangan: initialData.keterangan || ''
      });
      setInitialJumlah(Number(initialData.jumlah || 0));
      
      if (initialSupplierValue && daftarSupplier.length > 0) {
        const existingSupplier = daftarSupplier.find(s => s.namaSupplier === initialSupplierValue);
        if (existingSupplier) {
          setSupplierInputMode('select');
          setSelectedSupplierFromList(initialSupplierValue);
          setManualSupplierName('');
        } else { 
          setSupplierInputMode('manual');
          setManualSupplierName(initialSupplierValue);
          setSelectedSupplierFromList('');
        }
      } else if (initialSupplierValue) {
        setSupplierInputMode('manual');
        setManualSupplierName(initialSupplierValue);
      }
      else { 
        setSupplierInputMode('');
        setSelectedSupplierFromList('');
        setManualSupplierName('');
      }
    } else {
        setFormData({ namaBarang: '', jumlah: '', satuan: 'pcs', batasMinimum: '', supplier: '', hargaBeliSatuan: '', keterangan: '' });
    }
  }, [initialData, isEditMode, daftarSupplier]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSupplierInputModeChange = (e) => {
    const mode = e.target.value;
    setSupplierInputMode(mode);
    setFormData(prev => ({ ...prev, supplier: mode === 'select' ? selectedSupplierFromList : manualSupplierName }));
  };

  const handleSupplierListChange = (e) => {
    const value = e.target.value;
    setSelectedSupplierFromList(value);
    setFormData(prevData => ({ ...prevData, supplier: value }));
  };

  const handleManualSupplierChange = (e) => {
    const value = e.target.value;
    setManualSupplierName(value);
    if (supplierInputMode === 'manual') {
      setFormData(prevData => ({ ...prevData, supplier: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.namaBarang || formData.jumlah === '' || !formData.satuan || formData.batasMinimum === '') {
      showErrorToast('Nama Barang, Jumlah, Satuan, dan Batas Minimum wajib diisi.');
      setIsSubmitting(false);
      return;
    }
    
    const finalSupplier = supplierInputMode === 'select' ? selectedSupplierFromList : manualSupplierName.trim();
    const finalData = { ...formData, supplier: finalSupplier };

    try {
      if (isEditMode) {
        await updateStok(initialData.id, finalData);
        showSuccessToast('Stok berhasil diperbarui!');
      } else {
        if (formData.hargaBeliSatuan === '' || isNaN(parseFloat(formData.hargaBeliSatuan)) || parseFloat(formData.hargaBeliSatuan) < 0) {
            showErrorToast('Harga Beli Satuan wajib diisi dengan angka valid saat menambah barang baru.');
            setIsSubmitting(false);
            return;
        }
        await createStok(finalData);
        showSuccessToast('Stok berhasil ditambahkan!');
      }
      onSuccess();
    } catch (err) {
      showErrorToast(err.response?.data?.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} stok.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showHargaBeliInput = !isEditMode || (isEditMode && Number(formData.jumlah) !== initialJumlah);

  return (
    <form onSubmit={handleSubmit} className="stok-form profesional">
      <div className="form-row"><div className="form-group-flex"><label htmlFor="namaBarang">Nama Barang</label><input id="namaBarang" name="namaBarang" type="text" value={formData.namaBarang} onChange={handleInputChange} required /></div></div>
      <div className="form-row two-columns">
        <div className="form-group-flex"><label htmlFor="jumlah">Jumlah</label><input id="jumlah" name="jumlah" type="number" value={formData.jumlah} onChange={handleInputChange} required /></div>
        <div className="form-group-flex">
            <label htmlFor="satuan">Satuan</label>
            <select id="satuan" name="satuan" value={formData.satuan} onChange={handleInputChange} required>
                {unitOptions.map(group => (
                    <optgroup label={group.label} key={group.label}>
                        {group.options.map(option => (
                            <option value={option.value} key={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
      </div>
      <div className="form-row two-columns"><div className="form-group-flex"><label htmlFor="batasMinimum">ROP (Batas Minimum)</label><input id="batasMinimum" name="batasMinimum" type="number" value={formData.batasMinimum} onChange={handleInputChange} placeholder="Contoh : 10" required /></div>
        {showHargaBeliInput && (
            <div className="form-group-flex"><label htmlFor="hargaBeliSatuan">Harga Beli / Unit{isEditMode ? ' (Tambahan)' : '*'}</label><input id="hargaBeliSatuan" name="hargaBeliSatuan" type="number" step="1" value={formData.hargaBeliSatuan} onChange={handleInputChange} placeholder="Contoh : 30000" required={!isEditMode} /></div>
        )}
      </div>
      
      <div className="form-group-separator"><label>Informasi Tambahan (Opsional)</label></div>
      <div className="form-row"><div className="form-group-flex"><label htmlFor="supplierInputMode">Metode Input Supplier</label><select id="supplierInputMode" name="supplierInputMode" value={supplierInputMode} onChange={handleSupplierInputModeChange}><option value="">-- Pilih Metode --</option><option value="select">Pilih dari Daftar</option><option value="manual">Ketik Manual</option></select></div></div>
      {supplierInputMode === 'select' && (<div className="form-row"><div className="form-group-flex"><label htmlFor="selectedSupplierFromList">Pilih Supplier dari Daftar</label><select id="selectedSupplierFromList" name="selectedSupplierFromList" value={selectedSupplierFromList} onChange={handleSupplierListChange} disabled={loadingSuppliers || daftarSupplier.length === 0}><option value="">-- {loadingSuppliers ? "Memuat..." : (daftarSupplier.length === 0 ? "Belum ada supplier" : "Pilih Supplier")} --</option>{daftarSupplier.map(s => (<option key={s.id} value={s.namaSupplier}>{s.namaSupplier}</option>))}</select></div></div>)}
      {supplierInputMode === 'manual' && (<div className="form-row"><div className="form-group-flex"><label htmlFor="manualSupplierName">Nama Supplier (Manual)</label><input id="manualSupplierName" name="manualSupplierName" type="text" value={manualSupplierName} onChange={handleManualSupplierChange} placeholder="Ketik nama supplier baru" /></div></div>)}
      <div className="form-row"><div className="form-group-flex"><label htmlFor="keterangan">Keterangan</label><input type="text" id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleInputChange} /></div></div>
      <div className="form-actions"><button type="button" onClick={onClose} className="button-cancel">Batal</button><button type="submit" disabled={isSubmitting} className="button-submit">{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button></div>
    </form>
  );
}

export default StokForm;