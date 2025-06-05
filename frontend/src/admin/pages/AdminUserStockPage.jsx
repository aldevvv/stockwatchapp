// frontend/src/admin/pages/AdminUserStockPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom'; // Impor Link jika perlu tombol kembali
import api from '../../services/api'; // Instance axios terpusat
import { showErrorToast } from '../../utils/toastHelper';
import './AdminUserStockPage.css'; // Kita akan buat file CSS ini

const ITEMS_PER_PAGE = 10; // Untuk paginasi stok jika diperlukan

function AdminUserStockPage() {
  const { targetUserId } = useParams(); // Mengambil ID user dari URL
  const [userData, setUserData] = useState(null); // Untuk profil user yang dilihat
  const [userStok, setUserStok] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserStockData = async () => {
      if (!targetUserId) return;
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/admin/users/${targetUserId}/stok`);
        setUserData(response.data.userProfile || null);
        setUserStok(response.data.dataStok || []);
      } catch (err) {
        const fetchError = err.response?.data?.message || 'Gagal memuat data stok pengguna.';
        setError(fetchError);
        showErrorToast(fetchError);
        setUserData(null);
        setUserStok([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserStockData();
  }, [targetUserId]);

  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const items = userStok.slice(indexOfFirstItem, indexOfLastItem);
    const pages = Math.ceil(userStok.length / ITEMS_PER_PAGE);
    return { currentItems: items, totalPages: pages };
  }, [userStok, currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div className="admin-user-stock-page"><p>Memuat data stok pengguna...</p></div>;
  }
  if (error) {
    return <div className="admin-user-stock-page"><p className="error-message">{error}</p></div>;
  }
  if (!userData) {
    return <div className="admin-user-stock-page"><p>Tidak dapat menemukan data pengguna.</p></div>;
  }

  return (
    <div className="admin-user-stock-page">
      <div className="page-header-admin">
        <h1>Detail Stok Pengguna : {userData.namaLengkap || userData.email}</h1>
        {userData.namaToko && <p className="sub-header">Toko : {userData.namaToko}</p>}
        <Link to="/admin/users" className="button-back">Kembali ke Daftar Pengguna</Link>
      </div>

      {userStok.length === 0 ? (
        <p>Pengguna ini belum memiliki data stok.</p>
      ) : (
        <>
          <div className="table-responsive-admin">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Batas Min.</th>
                  <th>Satuan</th>
                  <th>Supplier</th>
                  <th>Status Notif</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.namaBarang}</td>
                    <td>{item.jumlah}</td>
                    <td>{item.batasMinimum}</td>
                    <td>{item.satuan}</td>
                    <td>{item.supplier || '-'}</td>
                    <td>
                      {item.notifikasiStokRendahSudahTerkirim ? 
                        <span className="status-badge status-notif-sent">Sudah Dinotif</span> : 
                        <span className="status-badge status-notif-pending">Aman/Belum</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {userStok.length > ITEMS_PER_PAGE && totalPages > 1 && (
            <div className="pagination-controls admin-pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage <= 1}
              >
                Sebelumnya
              </button>
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage >= totalPages}
              >
                Berikutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminUserStockPage;