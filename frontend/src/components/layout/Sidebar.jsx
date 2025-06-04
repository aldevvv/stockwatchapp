import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const DashboardIconSvg = ({ fill = "#ecf0f1" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} width="24px" height="24px">
    <path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const ProfileIconSvg = ({ fill = "#ecf0f1" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} width="24px" height="24px">
    <path d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
    { path: '/profil', name: 'Profil Saya', iconComponent: ProfileIconSvg },
    { path: '/dashboard', name: 'Dashboard', iconComponent: DashboardIconSvg },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <Link to="/dashboard" className="sidebar-logo">StockWatch</Link>}
        <button onClick={toggleSidebar} className="sidebar-toggle-button">
          {isOpen ? <span>&times;</span> : <span>&#9776;</span>}
        </button>
      </div>
      
      {isOpen && (
        <div className="sidebar-profile">
          <div className="profile-icon-container">
            <ProfileIconSvg fill="#bdc3c7" />
          </div>
          <p className="profile-name">{user?.namaLengkap || user?.email}</p>
          {user?.namaToko && <p className="store-name">{user.namaToko}</p>}
        </div>
      )}
      
      <ul className="sidebar-menu">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.iconComponent;
          return (
            <li key={item.path} title={!isOpen ? item.name : ''}>
              <Link to={item.path} className={isActive ? 'active' : ''}>
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