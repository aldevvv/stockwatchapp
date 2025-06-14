import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import './DashboardLayout.css';

function DashboardLayout() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isMobileSidebarOpen} toggleSidebar={toggleMobileSidebar} />
      
      <div className="dashboard-content-wrapper">
        <DashboardNavbar toggleSidebar={toggleMobileSidebar} />
        <main className="dashboard-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;