// frontend/src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css'; // Kita akan buat file CSS ini

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Arahkan ke login setelah logout
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">StockWatch</Link>
        {/* Anda bisa tambahkan logo gambar di sini jika mau */}
      </div>
      <div className="sidebar-profile">
        {/* Tampilkan nama user atau nama toko */}
        <p className="profile-name">{user?.namaLengkap || user?.email}</p>
        {user?.namaToko && <p className="store-name">{user.namaToko}</p>}
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/profil">Profil Saya</Link></li>
        {/* Tambahkan menu lain di sini nanti, contoh: */}
        {/* <li><Link to="/laporan">Laporan Stok</Link></li> */}
        {/* <li><Link to="/pengaturan">Pengaturan</Link></li> */}
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button-sidebar">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;