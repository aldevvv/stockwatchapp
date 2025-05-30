// frontend/src/components/layout/LandingNavbar.jsx
import React, { useState, useEffect } from 'react'; // Impor useState dan useEffect
import { Link, useNavigate } from 'react-router-dom';
import './LandingNavbar.css';

function LandingNavbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk menu mobile

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Opsional: Tutup menu mobile jika layar di-resize menjadi lebih besar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) { // Sesuaikan breakpoint jika perlu
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-container">
        <Link to="/" className="navbar-logo">StockWatch</Link>

        {/* Tombol Hamburger untuk Mobile */}
        <button className="navbar-toggler" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <span>&times;</span> : <span>&#9776;</span>} {/* Ganti ikon X dan Hamburger */}
        </button>

        {/* Menu untuk Desktop */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-menu">
            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link></li>
            <li><Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link></li>
            <li><Link to="/testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</Link></li>
          </ul>
          <div className="navbar-auth-buttons">
            <button 
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} 
              className="btn btn-login"
            >
              Login
            </button>
            <button 
              onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }} 
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