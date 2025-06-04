import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllStok, deleteStok as deleteStokService } from '../stok/stokService';
import Modal from '../components/Modal';
import StokForm from '../stok/StokForm';
import StokBarChart from './StokBarChart';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth(); 
  const [stok, setStok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStok, setEditingStok] = useState(null);

  const fetchDataStok = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllStok();
      setStok(response.data.data || []);
    } catch (err) {
      setError('Gagal memuat data stok.');
      console.error("Error di fetchDataStok:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchDataStok();
    }
  }, [user]);

  const handleFormSuccess = (updatedOrNewItem) => {
    if (editingStok) {
      setStok(prevStok =>
        prevStok.map(item =>
          item.id === updatedOrNewItem.id ? updatedOrNewItem : item
        )
      );
    } else {
      setStok(prevStok => [...prevStok, updatedOrNewItem]);
    }
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
        setStok(prevStok => prevStok.filter(item => item.id !== itemId));
        alert('Barang berhasil dihapus!');
      } catch (err) {
        alert('Gagal menghapus barang.');
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

  const renderContent = () => {
    if (loading) return <p>Memuat data stok...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (stok.length === 0) return <p>Anda belum memiliki data stok. Silakan tambahkan.</p>;

    return (
      <table className="stok-table">
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Jumlah Stok</th>
            <th>Batas Minimum Stok</th>
            <th>Satuan</th>
            <th>Supplier</th>
            <th>Ubah</th>
          </tr>
        </thead>
        <tbody>
          {stok.map((item) => (
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
      <div className="content-header">
        <h2>Daftar Stok Barang</h2>
        <button onClick={openModalForCreate} className="add-button">+ Tambah Stok</button>
      </div>
      {renderContent()}
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