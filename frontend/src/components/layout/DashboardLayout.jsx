import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="dashboard-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;