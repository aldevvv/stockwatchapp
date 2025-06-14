import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const BillingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>;

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const menuGroups = [
    {
      name: 'Manajemen Stok',
      icon: <BoxIcon />,
      subMenus: [
        { name: 'Dashboard', path: '/stock-dashboard' },
        { name: 'Daftar Stok', path: '/stock-list' },
        { name: 'Daftar Supplier', path: '/supplier-list' },
        { name: 'Riwayat Stok', path: '/stock-history' }
      ]
    },

    { name: 'Penjualan', icon: <ShoppingCartIcon />, subMenus: [
        { name: 'Daftar Produk', path: '/produk' },
        { name: 'Halaman Kasir', path: '/kasir' },
        { name: 'Penjualan Hari Ini', path: '/penjualan/hari-ini' },
        { name: 'Riwayat Penjualan', path: '/penjualan/riwayat'}]},
        
    { name: 'StockShare', icon: <ShareIcon />, subMenus: [
      { name: 'StockMarket', path: '/stock-market' },
      { name: 'Daftar Listing', path: '/daftar-listing' }]},

    { name: 'Billing', icon: <BillingIcon />, subMenus: [
      { name: 'Langganan & Saldo', path: '/billing' },
      { name: 'Semua Paket', path: '/semua-plan' }]},

    { name: 'Redeem Kode', icon: <GiftIcon />, subMenus: [
      { name: 'Redeem Kode', path: '/redeem-kode' }]},


    { name: 'Pengaturan', icon: <SettingsIcon />, subMenus: [
       { name: 'Pengaturan Akun', path: '/akun' },
       { name: 'Notifikasi', path: '/notifikasi' },
       { name: 'Deaktivasi Akun', path: '/deaktivasi'}]},
  ];

  useEffect(() => {
    const activeGroup = menuGroups.find(group =>
      group.subMenus?.some(sub => location.pathname.startsWith(sub.path))
    );
    setOpenMenu(activeGroup ? activeGroup.name : null);
  }, [location.pathname]);

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <Link to="/stock-dashboard" className="sidebar-logo-link">
          <img src="/Logo.png" alt="StockWatch Logo" className="sidebar-logo-img" />
        </Link>
        <button onClick={toggleSidebar} className="sidebar-mobile-close-btn">
          <CloseIcon />
        </button>
      </div>
      <ul className="sidebar-menu">
        {menuGroups.map(group => (
          <li key={group.name} className={`menu-item ${group.subMenus ? 'has-submenu' : ''} ${openMenu === group.name ? 'submenu-open' : ''}`}>
            {group.subMenus ? (
              <button onClick={() => handleMenuClick(group.name)}>
                <span className="menu-icon">{group.icon}</span>
                <span className="menu-text">{group.name}</span>
                <span className="submenu-arrow"><ChevronRightIcon /></span>
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
                  {group.subMenus.map(sub => (
                    <li key={sub.name} className="submenu-item">
                      <NavLink to={sub.path}>
                        {sub.name}
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

export default Sidebar;
