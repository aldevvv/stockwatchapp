import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllStok, deleteStok as deleteStokService } from '../stok/stokService';
import { getAllSuppliers } from '../supplier/supplierService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import Modal from '../components/Modal';
import StokForm from '../stok/StokForm';
import ListStokForm from '../stockshare/ListStokForm';
import StokBarChart from './StokBarChart';
import './DashboardPage.css';

const ITEM_PER_HALAMAN_DASHBOARD = 10;

function DashboardPage() {
  const { user } = useAuth();
  const [stok, setStok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStok, setEditingStok] = useState(null);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [itemToSell, setItemToSell] = useState(null);

  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const [kpiData, setKpiData] = useState({
    totalItemStok: 0,
    itemStokKritis: 0,
    jumlahSupplier: 0,
    totalNilaiInventaris: 0,
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

      const totalItems = stokItems.length;
      const kritisItems = stokItems.filter(item => Number(item.jumlah) <= Number(item.batasMinimum)).length;
      const totalSuppliers = supplierItems.length;
      
      let nilaiInventaris = 0;
      stokItems.forEach(item => {
        const hargaBeli = Number(item.hargaBeliTerakhir || item.hargaBeliAwal || 0);
        const jumlah = Number(item.jumlah);
        nilaiInventaris += (hargaBeli * jumlah);
      });

      setKpiData({
        totalItemStok: totalItems,
        itemStokKritis: kritisItems,
        jumlahSupplier: totalSuppliers,
        totalNilaiInventaris: nilaiInventaris,
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

  const handleFormSuccess = () => {
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

  const handleOpenListModal = (item) => {
    setItemToSell(item);
    setIsListModalOpen(true);
  };

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
    setItemToSell(null);
  };

  const handleListSuccess = () => {
    fetchData();
    handleCloseListModal();
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const renderStokTable = () => {
    if (loading && stok.length === 0) return <p>Memuat data stok...</p>;
    if (error && stok.length === 0) return <p style={{ color: 'red' }}>{error}</p>;
    if (!loading && stok.length === 0 && !error) return <p>Anda belum memiliki data stok. Silakan tambahkan.</p>;

    return (
      <div className="table-responsive">
        <table className="stok-table">
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Harga Modal/Unit</th>
              <th>Total Modal</th>
              <th>Batas Min.</th>
              <th>Satuan</th>
              <th>Supplier</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentStockItems.map((item) => {
              const hargaModalUnit = Number(item.hargaBeliTerakhir || item.hargaBeliAwal || 0);
              const totalModalItem = hargaModalUnit * Number(item.jumlah);
              const isKritis = Number(item.jumlah) <= Number(item.batasMinimum);

              return (
                <tr key={item.id} className={isKritis ? 'row-kritis' : ''}>
                  <td>{item.namaBarang}</td>
                  <td>{item.jumlah}</td>
                  <td>
                    {isKritis ? (
                      <span className="status-badge status-restock">Perlu Restock</span>
                    ) : (
                      <span className="status-badge status-aman">Aman</span>
                    )}
                  </td>
                  <td>{formatRupiah(hargaModalUnit)}</td>
                  <td>{formatRupiah(totalModalItem)}</td>
                  <td>{item.batasMinimum}</td>
                  <td>{item.satuan}</td>
                  <td>{item.supplier || '-'}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(item)} className="button-edit">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="button-delete">Hapus</button>
                    <button onClick={() => handleOpenListModal(item)} className="button-list-stock">Jual</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dashboard-page-content">
      {!loading && !error && (
        <div className="kpi-cards-container">
          <div className="kpi-card">
            <h3>Total Item Stok</h3>
            <p>{kpiData.totalItemStok}</p>
          </div>
          <div className="kpi-card critical">
            <h3>Stok di Bawah Minimum</h3>
            <p>{kpiData.itemStokKritis}</p>
          </div>
          <div className="kpi-card">
            <h3>Jumlah Supplier</h3>
            <p>{kpiData.jumlahSupplier}</p>
          </div>
          <div className="kpi-card inventory-value">
            <h3>Estimasi Nilai Inventaris</h3>
            <p>{formatRupiah(kpiData.totalNilaiInventaris)}</p>
          </div>
        </div>
      )}
      
      {loading && stok.length === 0 && <p>Memuat data utama...</p>}
      {error && stok.length > 0 && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}

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

      {isListModalOpen && (
        <Modal
          title={`Jual "${itemToSell?.namaBarang}" di StockShare`}
          isOpen={isListModalOpen}
          onClose={handleCloseListModal}
        >
          <ListStokForm 
            itemToSell={itemToSell}
            onSuccess={handleListSuccess}
            onClose={handleCloseListModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default DashboardPage;