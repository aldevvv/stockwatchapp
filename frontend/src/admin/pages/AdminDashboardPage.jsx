import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlatformStatsAdmin } from '../services/adminService';
import { showErrorToast } from '../../utils/toastHelper';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRegisteredUsers: 0,
    totalSystemStockItems: 0,
    totalSystemSuppliers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getPlatformStatsAdmin();
        setStats(response.data.data || { totalRegisteredUsers: 0, totalSystemStockItems: 0, totalSystemSuppliers: 0 });
      } catch (err) {
        const fetchError = err.response?.data?.message || 'Gagal memuat statistik platform.';
        setError(fetchError);
        showErrorToast(fetchError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="admin-dashboard-page"><p>Memuat statistik...</p></div>;
  }
  if (error) {
    return <div className="admin-dashboard-page"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="page-header-admin">
        <h1>Dashboard Administrator</h1>
      </div>

      <div className="admin-kpi-cards-container">
        <div className="admin-kpi-card users">
          <h3>Total Pengguna Terdaftar</h3>
          <p>{stats.totalRegisteredUsers}</p>
          <Link to="/admin/users" className="kpi-card-link">Kelola Pengguna</Link>
        </div>
        <div className="admin-kpi-card stock-items">
          <h3>Total Item Stok (Sistem)</h3>
          <p>{stats.totalSystemStockItems}</p>
        </div>
        <div className="admin-kpi-card suppliers">
          <h3>Total Supplier (Sistem)</h3>
          <p>{stats.totalSystemSuppliers}</p>
        </div>
      </div>

      <div className="admin-quick-actions">
        <h2>Aksi Cepat</h2>
        <div className="action-buttons-container">
            <Link to="/admin/users" className="action-button">
                Lihat Semua Pengguna
            </Link>
            <Link to="/admin/messages/send" className="action-button">
                Kirim Pesan ke Pengguna
            </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;