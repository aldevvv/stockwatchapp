import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllStok, deleteStok as deleteStokService } from '../stok/stokService';
import { getAllSuppliers } from '../supplier/supplierService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import StokForm from '../stok/StokForm';
import StokBarChart from './StokBarChart';
import './DashboardPage.css';

const ITEM_PER_HALAMAN_DASHBOARD = 6;

function DashboardPage() {
  const { user } = useAuth(); 
  const [stok, setStok] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStok, setEditingStok] = useState(null);
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);

  const [kpiData, setKpiData] = useState({
    totalItemStok: 0,
    itemStokKritis: 0,
    jumlahSupplier: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stokResponse, supplierResponse] = await Promise.all([
        getAllStok(),
        getAllSuppliers()
      ]);
      
      const stokItems = stokResponse.data.data || [];
      const supplierItems = supplierResponse.data.data || [];

      setStok(stokItems);
      setSuppliers(supplierItems);

      const totalItems = stokItems.length;
      const kritisItems = stokItems.filter(item => Number(item.jumlah) <= Number(item.batasMinimum)).length;
      const totalSuppliers = supplierItems.length;

      setKpiData({
        totalItemStok: totalItems,
        itemStokKritis: kritisItems,
        jumlahSupplier: totalSuppliers,
      });

    } catch (err) {
      const fetchError = err.response?.data?.message || 'Gagal memuat data dashboard.';
      setError(fetchError);
      showErrorToast(fetchError);
      console.error("Error di fetchData (Dashboard):", err);
    } finally {
      setLoading(false);
    }
  }, [user]); 

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    setHalamanSaatIni(1);
  }, [stok.length]);

  const { currentStockItems, totalHalaman } = useMemo(() => {
    const indexOfLastItem = halamanSaatIni * ITEM_PER_HALAMAN_DASHBOARD;
    const indexOfFirstItem = indexOfLastItem - ITEM_PER_HALAMAN_DASHBOARD;
    const currentItems = stok.slice(indexOfFirstItem, indexOfLastItem);
    const pages = Math.ceil(stok.length / ITEM_PER_HALAMAN_DASHBOARD);
    return { currentStockItems: currentItems, totalHalaman: pages };
  }, [stok, halamanSaatIni]);

  const gantiHalaman = (nomorHalaman) => {
    setHalamanSaatIni(nomorHalaman);
  };

  const handleFormSuccess = (updatedOrNewItem) => {
    fetchData(); 
    closeModal();
  };

  const handleEdit = (item) => {
    setEditingStok(item);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (itemId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        await deleteStokService(itemId);
        showSuccessToast('Barang berhasil dihapus!');
        fetchData();
      } catch (err) {
        const deleteErrorMsg = err.response?.data?.message || 'Gagal menghapus barang.';
        showErrorToast(deleteErrorMsg);
        console.error("Error di handleDelete:", err);
       }
    }
  };

  const openModalForCreate = () => {
    setEditingStok(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStok(null);
  };

  const renderStokTable = () => {
    if (loading && stok.length === 0) return <p>Memuat data stok...</p>;
    if (error && stok.length === 0) return <p style={{ color: 'red' }}>{error}</p>;
    if (!loading && stok.length === 0 && !error) return <p>Anda belum memiliki data stok. Silakan tambahkan.</p>;

    return (
      <table className="stok-table">
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Jumlah Stok</th>
            <th>Batas Minimum</th>
            <th>Satuan</th>
            <th>Supplier</th>
            <th>Perubahan</th>
          </tr>
        </thead>
        <tbody>
          {currentStockItems.map((item) => (
            <tr key={item.id}>
              <td>{item.namaBarang}</td>
              <td>{item.jumlah}</td>
              <td>{item.batasMinimum}</td>
              <td>{item.satuan}</td>
              <td>{item.supplier || '-'}</td>
              <td className="action-buttons">
                <button onClick={() => handleEdit(item)} className="button-edit">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="button-delete">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-page-content">
      {!loading && !error && (
        <div className="kpi-cards-container">
          <div className="kpi-card">
            <h3>Total Item</h3>
            <p>{kpiData.totalItemStok}</p>
          </div>
          <div className="kpi-card critical">
            <h3>Perlu Restock (ROP)</h3>
            <p>{kpiData.itemStokKritis}</p>
          </div>
          <div className="kpi-card">
            <h3>Jumlah Supplier</h3>
            <p>{kpiData.jumlahSupplier}</p>
          </div>
        </div>
      )}
      
      {loading && stok.length === 0 && <p>Memuat data utama...</p>}
      {error && stok.length === 0 && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}

      <div className="content-header">
        <h2>Daftar Stok Barang</h2>
        <button onClick={openModalForCreate} className="add-button">+ Tambah Stok</button>
      </div>
      
      {renderStokTable()}

      {!loading && stok.length > 0 && totalHalaman > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => gantiHalaman(halamanSaatIni - 1)}
            disabled={halamanSaatIni <= 1 || loading}
          >
            Sebelumnya
          </button>
          <span>
            Halaman {halamanSaatIni} dari {totalHalaman}
          </span>
          <button
            onClick={() => gantiHalaman(halamanSaatIni + 1)}
            disabled={halamanSaatIni >= totalHalaman || loading}
          >
            Berikutnya
          </button>
        </div>
      )}

      {!loading && !error && stok && stok.length > 0 && (
        <StokBarChart stokData={stok} />
      )}
      <Modal
        title={editingStok ? 'Edit Stok Barang' : 'Tambah Stok Baru'}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <StokForm
          onSuccess={handleFormSuccess}
          onClose={closeModal}
          initialData={editingStok}
        />
      </Modal>
    </div>
  );
}

export default DashboardPage;