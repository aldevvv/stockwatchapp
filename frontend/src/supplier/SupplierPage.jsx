import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllSuppliers, deleteSupplier as deleteSupplierService } from './supplierService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import SupplierForm from './SupplierForm';
import './SupplierPage.css';

const ITEM_PER_HALAMAN_SUPPLIER = 5;

function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAllSuppliers();
      setSuppliers(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data supplier:", err);
      const fetchError = err.response?.data?.message || 'Gagal memuat data supplier.';
      setError(fetchError);
      showErrorToast(fetchError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    setHalamanSaatIni(1);
  }, [suppliers.length]);

  const { currentSupplierItems, totalHalaman } = useMemo(() => {
    const indexOfLastItem = halamanSaatIni * ITEM_PER_HALAMAN_SUPPLIER;
    const indexOfFirstItem = indexOfLastItem - ITEM_PER_HALAMAN_SUPPLIER;
    const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
    const pages = Math.ceil(suppliers.length / ITEM_PER_HALAMAN_SUPPLIER);
    return { currentSupplierItems: currentItems, totalHalaman: pages };
  }, [suppliers, halamanSaatIni]);

  const gantiHalaman = (nomorHalaman) => {
    setHalamanSaatIni(nomorHalaman);
  };

  const handleOpenModalForCreate = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleFormSuccess = () => {
    fetchSuppliers();
    handleCloseModal();
  };

  const handleDeleteSupplier = async (supplierId, supplierName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus supplier "${supplierName}"?`)) {
      try {
        await deleteSupplierService(supplierId);
        showSuccessToast('Supplier berhasil dihapus!');
        fetchSuppliers();
      } catch (err) {
        console.error("Gagal menghapus supplier:", err);
        showErrorToast(err.response?.data?.message || 'Gagal menghapus supplier.');
      }
    }
  };

  const renderSupplierTable = () => {
    if (isLoading && suppliers.length === 0) return <p>Memuat data supplier...</p>;
    if (error && suppliers.length === 0) return <p className="error-message">{error}</p>;
    if (!isLoading && suppliers.length === 0 && !error) return <p>Belum ada data supplier. Silakan tambahkan supplier baru.</p>;
    
    if (currentSupplierItems.length === 0 && halamanSaatIni > 1) {
        gantiHalaman(halamanSaatIni - 1);
        return <p>Memuat data supplier...</p>;
    }
    if (currentSupplierItems.length === 0 && halamanSaatIni === 1 && suppliers.length > 0) {
        return <p>Tidak ada data supplier di halaman ini.</p>;
    }


    return (
        <div className="table-responsive">
          <table className="supplier-table">
            <thead>
              <tr>
                <th>Nama Supplier</th>
                <th>Barang Disuplai</th>
                <th>Nomor Telepon</th>
                <th>Email</th>
                <th>Alamat</th>
                <th>Info Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentSupplierItems.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.namaSupplier}</td>
                  <td>{supplier.barangDisuplai || '-'}</td>
                  <td>{supplier.nomorTelepon || '-'}</td>
                  <td>{supplier.emailSupplier || '-'}</td>
                  <td>{supplier.alamatSupplier || '-'}</td>
                  <td>{supplier.hargaBarangDariSupplier || '-'}</td>
                  <td className="action-buttons">
                    <button 
                      onClick={() => handleOpenModalForEdit(supplier)} 
                      className="button-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteSupplier(supplier.id, supplier.namaSupplier)} 
                      className="button-delete"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
  }


  return (
    <div className="supplier-page">
      <div className="page-header">
        <h1>Manajemen Supplier</h1>
        <button onClick={handleOpenModalForCreate} className="add-button-supplier">
          + Tambah Supplier Baru
        </button>
      </div>

      {renderSupplierTable()}
      
      {!isLoading && suppliers.length > 0 && totalHalaman > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => gantiHalaman(halamanSaatIni - 1)} 
            disabled={halamanSaatIni <= 1 || isLoading}
          >
            Sebelumnya
          </button>
          <span>
            Halaman {halamanSaatIni} dari {totalHalaman}
          </span>
          <button 
            onClick={() => gantiHalaman(halamanSaatIni + 1)} 
            disabled={halamanSaatIni >= totalHalaman || isLoading}
          >
            Berikutnya
          </button>
        </div>
      )}

      {isModalOpen && (
        <Modal 
          title={editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
        >
          <SupplierForm 
            onSuccess={handleFormSuccess} 
            onClose={handleCloseModal}
            initialData={editingSupplier}
          />
        </Modal>
      )}
    </div>
  );
}

export default SupplierPage;