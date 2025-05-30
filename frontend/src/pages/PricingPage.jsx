import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './InfoPage.css';
import './PricingPage.css';

function PricingPage() {
  const navigate = useNavigate(); 

  const handleFreeTierClick = () => {
    navigate('/register'); 
  };

  const handlePaidTierClick = () => {
    navigate('/pricing-info'); 
  };

  return (
    <div className="info-page-container">
      <div className="info-page-content">
        <h1>Paket Harga StockWatch</h1>
        <p className="pricing-intro">
          Pilih paket yang paling sesuai dengan kebutuhan bisnis Anda. Mulai gratis atau tingkatkan untuk fitur lebih lengkap.
        </p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free Tier</h3>
            <p className="price">Gratis</p>
            <ul>
              <li>Maks. 10 Produk</li>
              <li>1 Pengguna</li>
              <li>Dashboard Real-time (Terbatas)</li>
              <li>Notifikasi Stok Minimum (Email)</li>
            </ul>
            <button className="btn-pricing" onClick={handleFreeTierClick}>Mulai Sekarang</button>
          </div>
          <div className="pricing-card popular">
            <h3>Basic</h3>
            <p className="price">Rp 10.000<span className="price-period">/bulan</span></p>
            <ul>
              <li>Maks. 50 Produk</li>
              <li>Dashboard Penuh</li>
              <li>Notifikasi Stok (Email & WhatsApp)</li>
              <li>Riwayat Stok Dasar</li>
              <li>3 Pengguna</li>
            </ul>
            <button className="btn-pricing btn-popular" onClick={handlePaidTierClick}>Pilih Paket Basic</button>
          </div>
          <div className="pricing-card">
            <h3>Pro</h3>
            <p className="price">Rp 25.000<span className="price-period">/bulan</span></p>
            <ul>
              <li>Produk Tidak Terbatas</li>
              <li>Semua Fitur Basic</li>
              <li>Laporan Stok Lengkap (PDF)</li>
              <li>Integrasi Lanjutan</li>
              <li>5 Pengguna</li>
            </ul>
            {/* 4. Tambahkan onClick handler */}
            <button className="btn-pricing" onClick={handlePaidTierClick}>Pilih Paket Pro</button>
          </div>
          <div className="pricing-card">
            <h3>Custom</h3>
            <p className="price">Hubungi Kami</p>
            <ul>
              <li>Fitur Disesuaikan Kebutuhan</li>
              <li>Jumlah Pengguna Fleksibel</li>
              <li>Dukungan Prioritas</li>
              <li>Setup & Pelatihan Khusus</li>
              <li>Integrasi Sistem Pihak Ketiga</li>
            </ul>
            <button className="btn-pricing btn-contact" onClick={handlePaidTierClick}>Hubungi Tim Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;