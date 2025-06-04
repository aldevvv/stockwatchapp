import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const DashboardIconSvg = ({ fill = "#ecf0f1" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} width="24px" height="24px">
    <path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const ReportIcon = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={fill}>
        <path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
);

const SupplierIcon = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={fill}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M20 6H4V4h16v2zm-2-4H6v2h12V2zm4 8H2v12h20V10zm-4 2h-2v2h2v-2zm-4 0h-2v2h2v-2zm-4 0H8v2h2v-2zm-4 0H4v2h2v-2z"/>
    </svg>
);

const SettingsIcon = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={fill}>
        <path d="M0 0h24v24H0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg>
);

const LogoutIconSvg = ({ fill = "#ecf0f1" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={fill}>
        <path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
    </svg>
);

function Sidebar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', iconComponent: DashboardIconSvg },
    { path: '/riwayatstok', name: 'Riwayat Stok', iconComponent: ReportIcon },
    { path: '/suppliers', name: 'Manajemen Supplier', iconComponent: SupplierIcon },
    { path: '/pengaturan', name: 'Pengaturan', iconComponent: SettingsIcon },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <Link to="/dashboard" className="sidebar-logo">StockWatch</Link>}
        <button onClick={toggleSidebar} className="sidebar-toggle-button">
          {isOpen ? <span>&times;</span> : <span>&#9776;</span>}
        </button>
      </div>
      
      {isOpen && user && (
        <div className="sidebar-profile">
          <div className="profile-icon-container">
            <SettingsIcon fill="#bdc3c7" /> 
          </div>
          <p className="profile-name">{user.namaLengkap || user.email}</p>
          {user.namaToko && <p className="store-name">{user.namaToko}</p>}
        </div>
      )}
      
      <ul className="sidebar-menu">
        {menuItems.map(item => {
          const IconComponent = item.iconComponent;
          const isActive = location.pathname.startsWith(item.path); 
          return (
            <li key={item.path} title={!isOpen ? item.name : ''}>
              <Link to={item.targetPath || item.path} className={isActive ? 'active' : ''}>
                <span className="menu-icon">
                  <IconComponent fill={ (isOpen && isActive) || !isOpen ? '#FFFFFF' : '#ecf0f1'} />
                </span>
                {isOpen && <span className="menu-text">{item.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {isOpen && (
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button-sidebar">
            Logout
          </button>
        </div>
      )}
      {!isOpen && (
         <div className="sidebar-footer-collapsed">
            <button onClick={handleLogout} className="logout-button-sidebar-collapsed" title="Logout">
                <LogoutIconSvg />
            </button>
         </div>
      )}
    </div>
  );
}

export default Sidebar;