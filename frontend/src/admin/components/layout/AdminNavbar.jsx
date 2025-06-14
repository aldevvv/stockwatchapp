import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../../../components/layout/ProfileDropdown';
import './AdminNavbar.css';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

function AdminNavbar({ toggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="admin-navbar">
            <button className="admin-hamburger-btn" onClick={toggleSidebar}>
                <MenuIcon />
            </button>
            
            <div className="admin-navbar-right">
                <div className="navbar-action-item" ref={profileRef}>
                    <div className="profile-activator" onClick={() => setProfileOpen(!isProfileOpen)}>
                        <img 
                            src={user?.fotoProfilUrl || 'https://i.ibb.co/hK3aT2v/default-avatar.png'} 
                            alt="Profil Admin" 
                            className="profile-avatar"
                        />
                        <div className="navbar-user-info desktop-only">
                            <strong>{user?.namaLengkap}</strong>
                            <span>{user?.email}</span>
                        </div>
                    </div>
                    {isProfileOpen && <ProfileDropdown user={user} logout={handleLogout} />}
                </div>
            </div>
        </header>
    );
}

export default AdminNavbar;