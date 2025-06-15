import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPage.css'; 

function PricingInfoPage() {
  return (
    <div className="info-page-container">
      <div className="info-page-content" style={{ textAlign: 'center' }}>
        <h1>Segera Hadir!</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px' }}>
          Sistem pembayaran dan langganan untuk paket ini masih dalam tahap pengembangan.
        </p>
        <p>
          Kami bekerja keras untuk menyelesaikannya secepat mungkin. 
          Untuk saat ini, Anda bisa memulai dengan paket Free Tier atau hubungi kami jika Anda memiliki kebutuhan khusus.
        </p>
        <div style={{ marginTop: '40px' }}>
          <Link 
            to="/pricing" 
            style={{ 
              padding: '10px 20px', 
              fontSize: '1rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '5px',
              marginRight: '10px'
            }}
          >
            Kembali ke Halaman Harga
          </Link>
          <Link 
            to="/" 
            style={{ 
              padding: '10px 20px', 
              fontSize: '1rem', 
              backgroundColor: '#007bff', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '5px'
            }}
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PricingInfoPage;