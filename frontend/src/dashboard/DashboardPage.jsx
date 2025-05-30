import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllStok } from '../stok/stokService'; // Pastikan path ini benar
// Asumsi deleteStok juga ada di stokService, jika belum, Anda bisa menambahkannya atau menghapus bagian handleDelete
// import { deleteStok } from '../stok/stokService'; 
import Modal from '../components/Modal'; // Pastikan path ini benar
import StokForm from '../stok/StokForm'; // Pastikan path ini benar
import StokBarChart from './StokBarChart'; // Impor komponen grafik
import './DashboardPage.css';

function DashboardPage() {
  const { user, logout } = useAuth();
  const [stok, setStok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStok, setEditingStok] = useState(null);

  // Fungsi untuk mengambil data stok dari backend
  // Jika Anda sudah memiliki listener Firebase real-time di sini, fungsi ini mungkin berbeda
  // atau hanya dipanggil sekali saat inisialisasi.
  const fetchDataStok = async () => {
    try {
      setLoading(true);
      const response = await getAllStok();
      setStok(response.data.data || []);
      setError(null); // Reset error jika fetch berhasil
    } catch (err) {
      setError('Gagal memuat data stok.');
      console.error("Error di fetchDataStok:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Jika Anda belum menggunakan listener Firebase real-time untuk 'stok',
    // baris ini akan mengambil data saat komponen dimuat.
    // Jika sudah real-time, Anda mungkin tidak memerlukan fetch manual di sini
    // atau hanya untuk initial load.
    fetchDataStok(); 
  }, []);

  // Handler yang dijalankan setelah form (tambah/edit) berhasil disubmit
  const handleFormSuccess = (updatedOrNewItem) => {
    if (editingStok) {
      // Jika mode edit, perbarui item di dalam state 'stok'
      setStok(prevStok =>
        prevStok.map(item =>
          item.id === updatedOrNewItem.id ? updatedOrNewItem : item
        )
      );
    } else {
      // Jika mode tambah baru, tambahkan item ke state 'stok'
      setStok(prevStok => [...prevStok, updatedOrNewItem]);
    }
    closeModal(); // Tutup modal
  };

  // Handler saat tombol 'Edit' diklik
  const handleEdit = (item) => {
    setEditingStok(item);
    setIsModalOpen(true);
  };
  
  // Handler saat tombol 'Hapus' diklik
  const handleDelete = async (itemId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        // Pastikan Anda sudah membuat dan mengimpor fungsi deleteStok dari stokService.js
        // await deleteStok(itemId); 
        // Setelah berhasil delete di backend, update UI:
        setStok(prevStok => prevStok.filter(item => item.id !== itemId));
        alert('Barang berhasil dihapus (dari tampilan)! Implementasikan delete di backend.'); // Ganti jika sudah ada delete di backend
      } catch (err) {
        alert('Gagal menghapus barang.');
        console.error("Error di handleDelete:", err);
      }
    }
  };

  // Handler untuk membuka modal dalam mode 'Tambah'
  const openModalForCreate = () => {
    setEditingStok(null);
    setIsModalOpen(true);
  };
  
  // Handler untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStok(null);
  };

  // Fungsi untuk merender konten utama (tabel, pesan loading, atau error)
  const renderContent = () => {
    if (loading) return <p>Memuat data stok...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (stok.length === 0) return <p>Anda belum memiliki data stok. Silakan tambahkan.</p>;

    return (
      <table className="stok-table">
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Jumlah</th>
            <th>Batas Min.</th>
            <th>Satuan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {stok.map((item) => (
            <tr key={item.id}>
              <td>{item.namaBarang}</td>
              <td>{item.jumlah}</td>
              <td>{item.batasMinimum}</td>
              <td>{item.satuan}</td>
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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard StockWatch</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <Link to="/profil" className="profile-link">Profil Saya</Link>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="content-header">
          <h2>Daftar Stok Barang</h2>
          <button onClick={openModalForCreate} className="add-button">+ Tambah Stok</button>
        </div>
        {renderContent()}

        {/* Tampilkan Grafik jika tidak loading, tidak error, dan ada data stok */}
        {!loading && !error && stok && stok.length > 0 && (
          <StokBarChart stokData={stok} />
        )}
      </main>

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