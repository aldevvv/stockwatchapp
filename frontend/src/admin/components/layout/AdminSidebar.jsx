import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminSidebar.css';

const AdminDashboardIcon = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} width="24px" height="24px">
        <path d="M0 0h24v24H0z" fill="none"/><path d="M13 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9l-6-6zm5 16H6V5h7v5h5v9z"/>
    </svg>
);
const UsersAdminIcon = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={fill}>
        <path d="M0 0h24v24H0z" fill="none"/><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);
const MessageAdminIcon = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={fill}>
        <path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
    </svg>
);
const LogoutIconSvg = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={fill}>
        <path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
    </svg>
);

function AdminSidebar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard Admin', iconComponent: AdminDashboardIcon },
    { path: '/admin/users', name: 'Manajemen Pengguna', iconComponent: UsersAdminIcon },
    { path: '/admin/messages/send', name: 'Kirim Pesan Pengguna', iconComponent: MessageAdminIcon },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="admin-sidebar-header">
        {isOpen && <Link to="/admin/dashboard" className="admin-sidebar-logo">StockWatch</Link>}
        <button onClick={toggleSidebar} className="admin-sidebar-toggle-button">
          {isOpen ? <span>&times;</span> : <span>&#9776;</span>}
        </button>
      </div>
      
      {isOpen && user && (
        <div className="admin-sidebar-profile">
          <div className="admin-profile-icon-container">
            <UsersAdminIcon fill="#bdc3c7"/>
          </div>
          <p className="admin-profile-name">{user.namaLengkap || user.email}</p>
          <p className="admin-role-badge">Administrator</p>
        </div>
      )}
      
      <ul className="admin-sidebar-menu">
        {menuItems.map(item => {
          const IconComponent = item.iconComponent;
          const isActive = item.path === '/admin/dashboard' ? location.pathname === item.path : location.pathname.startsWith(item.path);
          return (
            <li key={item.path} title={!isOpen ? item.name : ''}>
              <Link to={item.path} className={isActive ? 'active' : ''}>
                <span className="admin-menu-icon">
                  <IconComponent fill={ (isOpen && isActive) || !isOpen ? '#FFFFFF' : '#e0e7ee'} />
                </span>
                {isOpen && <span className="admin-menu-text">{item.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {isOpen && (
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-button-sidebar">
            Logout Admin
          </button>
        </div>
      )}
      {!isOpen && (
         <div className="admin-sidebar-footer-collapsed">
            <button onClick={handleLogout} className="admin-logout-button-sidebar-collapsed" title="Logout Admin">
                <LogoutIconSvg />
            </button>
         </div>
      )}
    </div>
  );
}

export default AdminSidebar;