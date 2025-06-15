import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import './PengaturanLayout.css';

function PengaturanLayout() {
    const location = useLocation();
    const getTitle = () => {
        switch (location.pathname) {
            case '/pengaturan/akun': return 'Profil & Keamanan';
            case '/pengaturan/notifikasi': return 'Preferensi Notifikasi';
            case '/pengaturan/deaktivasi': return 'Deaktivasi Akun';
            default: return 'Pengaturan';
        }
    };

    const settingsNavLinks = [
        { path: '/pengaturan/akun', title: 'Pengaturan Akun' },
        { path: '/pengaturan/notifikasi', title: 'Notifikasi' },
        { path: '/pengaturan/deaktivasi', title: 'Deaktivasi Akun' },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>{getTitle()}</h2>
            </div>
            <div className="pengaturan-layout">
                <nav className="pengaturan-nav">
                    {settingsNavLinks.map(link => (
                        <NavLink key={link.path} to={link.path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            {link.title}
                        </NavLink>
                    ))}
                </nav>
                <main className="pengaturan-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PengaturanLayout;