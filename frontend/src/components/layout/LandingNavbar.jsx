import React, { useState, useEffect } from 'react';
// --- [EDIT 1] 'Link' diubah menjadi 'NavLink' ---
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './LandingNavbar.css';

function LandingNavbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ... (kode useEffect Anda tidak perlu diubah) ...
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.landing-navbar')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-container">
        {/* Logo tetap menggunakan Link biasa atau bisa juga NavLink jika perlu style aktif */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          StockWatch
        </Link>

        <button 
          className="navbar-toggler" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-menu">
            {/* --- [EDIT 2] Semua <Link> di sini diubah menjadi <NavLink> --- */}
            <li>
              <NavLink to="/" onClick={closeMobileMenu}>
                Beranda
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMobileMenu}>
                Tentang Kami
              </NavLink>
            </li>
            <li>
              <NavLink to="/pricing" onClick={closeMobileMenu}>
                Harga
              </NavLink>
            </li>
            <li>
              <NavLink to="/testimonials" onClick={closeMobileMenu}>
                Testimoni
              </NavLink>
            </li>
          </ul>
          
          <div className="navbar-auth-buttons">
            <button 
              onClick={() => { navigate('/login'); closeMobileMenu(); }} 
              className="btn btn-login"
            >
              Masuk
            </button>
            <button 
              onClick={() => { navigate('/register'); closeMobileMenu(); }} 
              className="btn btn-register"
            >
              Daftar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;