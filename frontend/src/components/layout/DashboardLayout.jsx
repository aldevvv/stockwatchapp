// frontend/src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css'; // Kita akan buat file CSS ini

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content">
        <Outlet /> {/* Konten halaman (DashboardPage, ProfilePage, dll.) akan dirender di sini */}
      </main>
    </div>
  );
}

export default DashboardLayout;