import React, { useState, useEffect, useCallback } from 'react';
import { getAllProduk, createProduk, updateProduk, deleteProduk } from './produkService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import ProdukForm from './ProdukForm';
import '../styles/DashboardPages.css';

function ProdukPage() {
  const [produk, setProduk] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);

  const fetchProduk = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllProduk();
      setProduk(response.data.data || []);
    } catch (error) {
      showErrorToast("Gagal memuat data produk.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduk();
  }, [fetchProduk]);

  const handleOpenModalForCreate = () => {
    setEditingProduk(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (p) => {
    setEditingProduk(p);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduk(null);
  };
  
  const handleFormSuccess = async (formData, isEdit, produkId) => {
    try {
        if (isEdit) {
            await updateProduk(produkId, formData);
            showSuccessToast("Produk berhasil diperbarui!");
        } else {
            await createProduk(formData);
            showSuccessToast("Produk baru berhasil dibuat!");
        }
        fetchProduk();
    } catch (error) {
        showErrorToast(error.response?.data?.message || "Gagal menyimpan produk.");
    } finally {
        handleCloseModal();
    }
  };
  
  const handleDeleteProduk = async (id, name) => {
    if(window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
        try {
            await deleteProduk(id);
            showSuccessToast("Produk berhasil dihapus.");
            fetchProduk();
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Gagal menghapus produk.");
        }
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Daftar Produk Jual</h2>
        <button onClick={handleOpenModalForCreate} className="button-add">+ Tambah Produk Baru</button>
      </div>
      
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Produk Jadi</th>
                <th>Harga Modal (HPP)</th>
                <th>Harga Jual</th>
                <th>Potensi Laba</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Memuat data produk...</td></tr>
              ) : produk.length > 0 ? (
                produk.map(p => (
                  <tr key={p.id}>
                    <td>{p.namaProduk}</td>
                    <td>{formatRupiah(p.hargaModal)}</td>
                    <td>{formatRupiah(p.hargaJual)}</td>
                    <td>{formatRupiah(p.hargaJual - p.hargaModal)}</td>
                    <td className="action-buttons">
                      <button className="button-edit" onClick={() => handleOpenModalForEdit(p)}>Edit</button>
                      <button className="button-delete" onClick={() => handleDeleteProduk(p.id, p.namaProduk)}>Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal title={editingProduk ? "Edit Produk Jual" : "Buat Produk Jual Baru"} isOpen={isModalOpen} onClose={handleCloseModal}>
          <ProdukForm onSuccess={handleFormSuccess} onClose={handleCloseModal} initialData={editingProduk} />
        </Modal>
      )}
    </div>
  );
}
export default ProdukPage;