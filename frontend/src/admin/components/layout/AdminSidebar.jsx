import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import './AdminSidebar.css';

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const RedeemIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const menuGroups = useMemo(() => [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { name: 'Kelola Pengguna', icon: <UsersIcon />, subMenus: [ { name: 'Daftar Pengguna', path: '/admin/manajemen-pengguna' }, { name: 'Tambah Saldo', path: '/admin/tambah-saldo' } ] },
    { name: 'Kelola Hadiah', icon: <RedeemIcon />, subMenus: [ { name: 'Redeem Kode', path: '/admin/kode-redeem' } ] },
  ], []);

  useEffect(() => {
    const activeGroup = menuGroups.find(group => 
      group.subMenus?.some(submenu => location.pathname === submenu.path)
    );
    setOpenMenu(activeGroup?.name || null);
  }, [location.pathname, menuGroups]);

  return (
    <nav className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="admin-sidebar-header">
        <Link to="/admin/dashboard" className="admin-logo-link">
            <img src="/Logo.png" alt="StockWatch Logo" className="admin-sidebar-logo" />
        </Link>
        <button onClick={toggleSidebar} className="sidebar-mobile-close-btn">
            <CloseIcon />
        </button>
      </div>
      <ul className="admin-sidebar-menu">
        {menuGroups.map(group => (
          <li key={group.name} className={`menu-item ${group.subMenus ? 'has-submenu' : ''} ${openMenu === group.name ? 'submenu-open' : ''}`}>
            {group.subMenus ? (
              <button onClick={() => setOpenMenu(openMenu === group.name ? null : group.name)}>
                <span className="menu-icon">{group.icon}</span>
                <span className="menu-text">{group.name}</span>
                <span className="submenu-arrow"><ChevronRightIcon/></span>
              </button>
            ) : (
              <NavLink to={group.path}>
                <span className="menu-icon">{group.icon}</span>
                <span className="menu-text">{group.name}</span>
              </NavLink>
            )}
            {group.subMenus && (
              <div className="submenu-container-wrapper">
                <ul className="submenu-container">
                  {group.subMenus.map(submenu => (
                    <li key={submenu.name} className="submenu-item">
                      <NavLink to={submenu.path} className={({ isActive }) => isActive ? "active" : ""}>
                        {submenu.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AdminSidebar;