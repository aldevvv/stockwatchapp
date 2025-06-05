import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { showErrorToast } from '../../utils/toastHelper';
import './AdminUsersPage.css';

const ITEMS_PER_PAGE_ADMIN_USERS = 10;

function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get('/admin/users'); 
        setAllUsers(response.data.data || []);
        setFilteredUsers(response.data.data || []);
      } catch (err) {
        const fetchError = err.response?.data?.message || 'Gagal memuat data pengguna.';
        setError(fetchError);
        showErrorToast(fetchError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const newFilteredData = allUsers.filter(user => {
      return (
        user.namaLengkap?.toLowerCase().includes(lowercasedFilter) ||
        user.email?.toLowerCase().includes(lowercasedFilter) ||
        user.namaToko?.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredUsers(newFilteredData);
    setCurrentPage(1); 
  }, [searchTerm, allUsers]);

  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE_ADMIN_USERS;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE_ADMIN_USERS;
    const itemsToPaginate = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const pages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE_ADMIN_USERS);
    return { currentItems: itemsToPaginate, totalPages: pages };
  }, [filteredUsers, currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading && allUsers.length === 0) return <div className="admin-users-page"><p>Memuat data pengguna...</p></div>;
  if (error && allUsers.length === 0) return <div className="admin-users-page"><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="admin-users-page">
      <div className="page-header-admin">
        <h1>Manajemen Pengguna</h1>
      </div>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Cari berdasarkan Nama, Email, atau Nama Toko..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="admin-search-input"
        />
      </div>

      {isLoading && allUsers.length > 0 ? (
         <p>Memuat...</p>
      ): !isLoading && filteredUsers.length === 0 ? (
        <p>Tidak ada pengguna yang cocok dengan pencarian Anda atau belum ada data pengguna.</p>
      ) : (
        <div className="table-responsive-admin">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Nama Toko</th>
                <th>Status Verifikasi</th>
                <th>Role</th>
                <th>ID Pengguna</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(user => (
                <tr key={user.id}>
                  <td>{user.namaLengkap || '-'}</td>
                  <td>{user.email}</td>
                  <td>{user.namaToko || '-'}</td>
                  <td>
                    <span className={`status-badge ${user.isEmailVerified ? 'status-verified' : 'status-not-verified'}`}>
                      {user.isEmailVerified ? 'Terverifikasi' : 'Belum'}
                    </span>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="user-id-cell" title={user.id}>{user.id ? user.id.substring(0,8) + '...' : '-'}</td>
                  <td className="action-buttons-admin">
                    <Link 
                      to={`/admin/users/${user.id}/stok`}
                      className="button-view-details"
                    >
                      Lihat Stok
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && filteredUsers.length > ITEMS_PER_PAGE_ADMIN_USERS && totalPages > 1 && (
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
    </div>
  );
}

export default AdminUsersPage;