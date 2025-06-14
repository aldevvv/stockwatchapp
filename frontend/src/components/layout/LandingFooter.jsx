import React from 'react';
import { Link } from 'react-router-dom';
import './LandingFooter.css';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

function LandingFooter() {

  const navLinks = [
    { title: 'Beranda', path: '/' },
    { title: 'Tentang Kami', path: '/tentang-kami' },
    { title: 'Harga', path: '/harga' },
    { title: 'Testimoni', path: '/testimoni' },
  ];

  const companyLinks = [
    { title: 'Hubungi Kami', path: '/hubungi-kami' },
    { title: 'FAQ', path: '/faq' },
    { title: 'Syarat & Ketentuan', path: '/terms' },
    { title: 'Kebijakan Privasi', path: '/privacypolicy' },
  ];

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-content-grid">
          <div className="footer-column brand-column">
            <Link to="/" className="footer-logo-link">
              <img src="/Logo.png" alt="StockWatch Logo" className="footer-logo-img" />
            </Link>
            <p className="footer-tagline">Manajemen Stok Cerdas untuk UMKM. Lacak Stok, Dapatkan Notifikasi & Optimalkan Bisnis Anda Dengan Mudah.</p>
            <div className="footer-social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </div>

          <div className="footer-column links-column">
            <h3>Navigasi</h3>
            <ul className="footer-links">
              {navLinks.map(link => (
                <li key={link.title}><Link to={link.path}>{link.title}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-column links-column">
            <h3>Perusahaan</h3>
            <ul className="footer-links">
              {companyLinks.map(link => (
                <li key={link.title}><Link to={link.path}>{link.title}</Link></li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} StockWatch. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
}

export default LandingFooter;