import React, { useState, useEffect } from 'react';
import { createStok, updateJumlahStokService, updateDetailStokItemService } from './stokService';
import { getAllSuppliers } from '../supplier/supplierService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import './StokForm.css';

const INPUT_MODE_SELECT = 'select';
const INPUT_MODE_MANUAL = 'manual';
const INPUT_MODE_NONE = '';

function StokForm({ onSuccess, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    namaBarang: '',
    jumlah: '',
    satuan: 'pcs',
    batasMinimum: '',
    supplier: '',
    hargaBeliSatuan: '',
    hargaBeliAwal: '', 
    hargaBeliTerakhir: '',
    keterangan: ''
  });
  
  const [initialJumlah, setInitialJumlah] = useState(0);
  
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
      const initialSupplierValue = initialData.supplier || '';
      setFormData({
        namaBarang: initialData.namaBarang || '',
        jumlah: initialData.jumlah || '',
        satuan: initialData.satuan || 'pcs',
        batasMinimum: initialData.batasMinimum || '',
        supplier: initialSupplierValue,
        hargaBeliSatuan: '', 
        hargaBeliAwal: initialData.hargaBeliAwal || '',
        hargaBeliTerakhir: initialData.hargaBeliTerakhir || '',
        keterangan: initialData.keterangan || ''
      });
      setInitialJumlah(Number(initialData.jumlah || 0));
      
      if (initialSupplierValue) {
        const existingSupplier = daftarSupplier.find(s => s.namaSupplier === initialSupplierValue);
        if (existingSupplier && daftarSupplier.length > 0) {
          setSupplierInputMode(INPUT_MODE_SELECT);
          setSelectedSupplierFromList(initialSupplierValue);
          setManualSupplierName('');
        } else { 
          setSupplierInputMode(INPUT_MODE_MANUAL);
          setManualSupplierName(initialSupplierValue);
          setSelectedSupplierFromList('');
        }
      } else { 
        setSupplierInputMode(INPUT_MODE_NONE);
        setSelectedSupplierFromList('');
        setManualSupplierName('');
      }
    } else { 
      setFormData({
        namaBarang: '',
        jumlah: '',
        satuan: 'pcs',
        batasMinimum: '',
        supplier: '',
        hargaBeliSatuan: '',
        hargaBeliAwal: '',
        hargaBeliTerakhir: '',
        keterangan: ''
      });
      setInitialJumlah(0);
      setSupplierInputMode(INPUT_MODE_NONE);
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
    
    const currentJumlah = Number(formData.jumlah);
    const currentHargaBeliSatuan = parseFloat(formData.hargaBeliSatuan);
    const currentHargaBeliAwal = parseFloat(formData.hargaBeliAwal);
    const currentHargaBeliTerakhir = parseFloat(formData.hargaBeliTerakhir);

    if (!formData.namaBarang || formData.jumlah === '' || !formData.satuan || formData.batasMinimum === '') {
      showErrorToast('Nama Barang, Jumlah, Satuan, dan Batas Minimum wajib diisi.');
      setIsSubmitting(false);
      return;
    }
    
    if (!isEditMode && (formData.hargaBeliSatuan === '' || isNaN(currentHargaBeliSatuan) || currentHargaBeliSatuan < 0)) {
      showErrorToast('Harga Beli Satuan wajib diisi dengan angka valid saat menambah barang baru.');
      setIsSubmitting(false);
      return;
    }

    try {
      let successMessage = '';
      let finalItemData;

      if (isEditMode) {
        let itemAfterJumlahUpdate = null;

        if (currentJumlah !== initialJumlah) {
          const jumlahPerubahan = currentJumlah - initialJumlah;
          const jenisPerubahan = jumlahPerubahan > 0 ? 'PENAMBAHAN_MANUAL' : 'PENGURANGAN_MANUAL';
          
          let hargaBeliUntukUpdate = 0;
          if (jenisPerubahan === 'PENAMBAHAN_MANUAL') {
            if (formData.hargaBeliSatuan === '' || isNaN(currentHargaBeliSatuan) || currentHargaBeliSatuan < 0) {
              showErrorToast('Harga Beli Satuan wajib diisi dengan angka valid untuk penambahan stok.');
              setIsSubmitting(false);
              return;
            }
            hargaBeliUntukUpdate = currentHargaBeliSatuan;
          }

          const jumlahPayload = {
            jenisPerubahan,
            jumlahPerubahan,
            keterangan: formData.keterangan || `Jumlah diubah dari ${initialJumlah} ke ${currentJumlah}`,
            ...(jenisPerubahan === 'PENAMBAHAN_MANUAL' && { hargaBeliSatuan: hargaBeliUntukUpdate })
          };
          const responseJumlah = await updateJumlahStokService(initialData.id, jumlahPayload);
          itemAfterJumlahUpdate = responseJumlah.data.data;
          successMessage = 'Jumlah stok berhasil diperbarui. ';
        }

        const detailDataToUpdate = {
            namaBarang: formData.namaBarang,
            satuan: formData.satuan,
            batasMinimum: Number(formData.batasMinimum),
            supplier: supplierToSubmit,
            keterangan: formData.keterangan,
            hargaBeliAwal: formData.hargaBeliAwal !== '' && !isNaN(currentHargaBeliAwal) ? currentHargaBeliAwal : Number(initialData.hargaBeliAwal || 0),
            hargaBeliTerakhir: formData.hargaBeliTerakhir !== '' && !isNaN(currentHargaBeliTerakhir) ? currentHargaBeliTerakhir : Number(initialData.hargaBeliTerakhir || 0)
        };
        
        let hasDetailChanges = false;
        if (initialData) {
            if (initialData.namaBarang !== detailDataToUpdate.namaBarang ||
                initialData.satuan !== detailDataToUpdate.satuan ||
                Number(initialData.batasMinimum) !== detailDataToUpdate.batasMinimum ||
                (initialData.supplier || '') !== detailDataToUpdate.supplier ||
                (initialData.keterangan || '') !== detailDataToUpdate.keterangan ||
                Number(initialData.hargaBeliAwal || 0) !== detailDataToUpdate.hargaBeliAwal ||
                Number(initialData.hargaBeliTerakhir || 0) !== detailDataToUpdate.hargaBeliTerakhir ) {
                hasDetailChanges = true;
            }
        }
        
        if (hasDetailChanges) {
            const responseDetail = await updateDetailStokItemService(initialData.id, detailDataToUpdate);
            finalItemData = responseDetail.data.data;
            successMessage += 'Detail stok berhasil diperbarui.';
        } else if (itemAfterJumlahUpdate) {
            finalItemData = itemAfterJumlahUpdate;
        } else {
            finalItemData = initialData; 
            successMessage = "Tidak ada perubahan disimpan.";
        }
        
        showSuccessToast(successMessage.trim() || "Perubahan stok berhasil disimpan.");
        onSuccess(finalItemData);

      } else {
        const createData = { 
          namaBarang: formData.namaBarang,
          jumlah: currentJumlah,
          satuan: formData.satuan,
          batasMinimum: Number(formData.batasMinimum),
          supplier: supplierToSubmit,
          hargaBeliSatuan: currentHargaBeliSatuan,
          keterangan: formData.keterangan
        };
        const response = await createStok(createData);
        showSuccessToast('Stok berhasil ditambahkan!');
        onSuccess(response.data.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} stok.`;
      showErrorToast(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showHargaBeliUntukPenambahanInput = !isEditMode || (isEditMode && Number(formData.jumlah) > initialJumlah);

  return (
    <form onSubmit={handleSubmit} className="stok-form profesional">
      <div className="form-row">
        <div className="form-group-flex">
            <label htmlFor="namaBarang">Nama Barang*</label>
            <input id="namaBarang" name="namaBarang" type="text" value={formData.namaBarang} onChange={handleInputChange} required />
        </div>
      </div>
      
      <div className="form-row two-columns">
        <div className="form-group-flex">
          <label htmlFor="jumlah">Jumlah*</label>
          <input id="jumlah" name="jumlah" type="number" value={formData.jumlah} onChange={handleInputChange} required />
        </div>
        <div className="form-group-flex">
          <label htmlFor="satuan">Satuan*</label>
          <input id="satuan" name="satuan" type="text" value={formData.satuan} onChange={handleInputChange} placeholder="pcs, kg, liter" required />
        </div>
      </div>
      
      <div className="form-row two-columns">
        <div className="form-group-flex">
          <label htmlFor="batasMinimum">Batas Minimum Notifikasi*</label>
          <input id="batasMinimum" name="batasMinimum" type="number" value={formData.batasMinimum} onChange={handleInputChange} placeholder="Contoh: 10" required />
        </div>
        {showHargaBeliUntukPenambahanInput && (
            <div className="form-group-flex">
            <label htmlFor="hargaBeliSatuan">Harga Beli/Modal per Satuan{isEditMode ? ' (Tambahan)' : '*'}</label>
            <input 
                id="hargaBeliSatuan" 
                name="hargaBeliSatuan" 
                type="number" 
                step="0.01"
                value={formData.hargaBeliSatuan} 
                onChange={handleInputChange} 
                placeholder="Harga beli item ini"
                required={!isEditMode}
            />
            </div>
        )}
      </div>
      
      {isEditMode && (
          <div className="form-row two-columns">
              <div className="form-group-flex">
                  <label htmlFor="hargaBeliAwal">Harga Beli Awal (Info)</label>
                  <input type="number" id="hargaBeliAwal" name="hargaBeliAwal" value={formData.hargaBeliAwal} onChange={handleInputChange} step="0.01" />
              </div>
              <div className="form-group-flex">
                  <label htmlFor="hargaBeliTerakhir">Harga Beli Terakhir (Info)</label>
                  <input type="number" id="hargaBeliTerakhir" name="hargaBeliTerakhir" value={formData.hargaBeliTerakhir} onChange={handleInputChange} step="0.01" />
              </div>
          </div>
      )}

      <div className="form-group-separator">
        <label>Informasi Tambahan (Opsional)</label>
      </div>

      <div className="form-row">
        <div className="form-group-flex">
          <label htmlFor="supplierInputMode">Metode Input Supplier</label>
          <select 
            id="supplierInputMode" 
            name="supplierInputMode" 
            value={supplierInputMode} 
            onChange={handleSupplierInputModeChange}
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
            />
          </div>
        </div>
      )}
      
      <div className="form-row">
        <div className="form-group-flex">
          <label htmlFor="keterangan">Keterangan</label>
          <input type="text" id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleInputChange} />
        </div>
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