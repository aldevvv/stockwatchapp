import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import './AdminLayout.css';

function AdminLayout() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="admin-layout">
      {isMobileSidebarOpen && <div className="admin-sidebar-overlay" onClick={toggleMobileSidebar}></div>}
      <AdminSidebar isOpen={isMobileSidebarOpen} toggleSidebar={toggleMobileSidebar} />
      <div className="admin-content-wrapper">
        <AdminNavbar toggleSidebar={toggleMobileSidebar} />
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;