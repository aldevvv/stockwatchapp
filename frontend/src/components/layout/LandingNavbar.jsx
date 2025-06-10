import React, { useState, useEffect } from 'react';
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
        <Link to="/" className="navbar-logo">
  <img src="/Logo.png" alt="StockWatch Logo" className="navbar-logo-img" />
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
                        <li>
              <NavLink to="/contactus" onClick={closeMobileMenu}>
                Hubungi Kami
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