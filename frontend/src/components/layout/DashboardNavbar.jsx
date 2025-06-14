import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import './DashboardNavbar.css';

const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const HamburgerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

function DashboardNavbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="dashboard-navbar">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <HamburgerIcon />
      </button>

      <div className="navbar-right">
        <div className="navbar-action-item" ref={notifRef}>
            <button className="notification-btn" onClick={() => setNotifOpen(!isNotifOpen)}>
                <BellIcon />
                <span className="notification-badge">2</span>
            </button>
            {isNotifOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header"><h3>Notifikasi Sistem</h3></div>
                    <ul className="notification-list">
                        <li className="notification-item unread">
                            <p><strong>Update Sistem -</strong> Fitur Laporan Penjualan Sekarang Lebih Canggih.</p>
                            <small>2 jam lalu</small>
                        </li>
                        <li className="notification-item unread">
                            <p><strong>Promo Diperpanjang -</strong> Paket Pro Diskon 50% Hingga Akhir Bulan.</p>
                            <small>1 hari lalu</small>
                        </li>
                         <li className="notification-item">
                            <p><strong>Maintenance Sistem -</strong> Fitur Notifikasi via Whatsapp Saat Ini Tidak Tersedia.</p>
                            <small>1 hari lalu</small>
                        </li>
                    </ul>
                    <div className="dropdown-footer">
                        <button>Tandai semua telah dibaca</button>
                    </div>
                </div>
            )}
        </div>
        
        <div className="navbar-action-item" ref={profileRef}>
            <div className="profile-activator" onClick={() => setProfileOpen(!isProfileOpen)}>
                <img 
                    src={user?.fotoProfilUrl || 'https://www.iconpacks.net/icons/2/free-user-icon-3297-thumb.png'} 
                    alt="Profil" 
                    className="profile-avatar"
                />
                <div className="navbar-user-info desktop-only">
                    <strong>{user?.namaLengkap || 'Pengguna'}</strong>
                    <span>{user?.email}</span>
                </div>
            </div>
            {isProfileOpen && <ProfileDropdown user={user} logout={handleLogout} />}
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;