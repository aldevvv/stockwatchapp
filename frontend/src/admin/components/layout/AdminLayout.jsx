// frontend/src/admin/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css'; // Kita akan buat file CSS ini

function AdminLayout() {
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(true);

  const toggleAdminSidebar = () => {
    setIsAdminSidebarOpen(!isAdminSidebarOpen);
  };

  return (
    <div className={`admin-layout ${isAdminSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <AdminSidebar isOpen={isAdminSidebarOpen} toggleSidebar={toggleAdminSidebar} />
      <main className="admin-main-content">
        <Outlet /> {/* Konten halaman admin akan dirender di sini */}
      </main>
    </div>
  );
}

export default AdminLayout;