import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PricingPage.css';

function PricingPage() {
  const navigate = useNavigate();

  // Data paket didefinisikan dalam satu array agar mudah dikelola
  const pricingPlans = [
    {
      type: 'Starter',
      badge: 'Coba Gratis',
      price: 'Gratis',
      period: 'Untuk memulai',
      features: [
        'Kelola hingga 10 produk',
        '1 akun pengguna',
        'Dashboard monitoring dasar',
        'Notifikasi email stok menipis',
        'Dukungan komunitas',
      ],
      buttonText: 'Mulai Gratis Sekarang',
      buttonClass: 'btn-outline',
      action: () => navigate('/register'),
    },
    {
      type: 'UMKM Basic',
      badge: 'Hemat 40%',
      price: 'Rp 15.000',
      period: '/bulan',
      features: [
        'Kelola hingga 50 produk',
        'Dashboard lengkap real-time',
        'Notifikasi Email & WhatsApp',
        'Laporan stok harian',
        '3 akun pengguna',
        'Dukungan chat prioritas',
      ],
      buttonText: 'Pilih Paket Terpopuler',
      buttonClass: 'btn-popular',
      isPopular: true,
      action: () => navigate('/pricing-info'),
    },
    {
      type: 'UMKM Pro',
      badge: 'Terlengkap',
      price: 'Rp 25.000',
      period: '/bulan',
      features: [
        'Produk TANPA BATAS',
        'Semua fitur UMKM Basic',
        'Laporan PDF otomatis',
        'Integrasi dengan toko online',
        '5 akun pengguna',
        'Analisis tren penjualan',
        'Backup data otomatis',
      ],
      buttonText: 'Upgrade ke Pro',
      buttonClass: '',
      action: () => navigate('/pricing-info'),
    },
    {
      type: 'Enterprise',
      badge: 'Eksklusif',
      price: 'Konsultasi Gratis',
      period: 'Disesuaikan kebutuhan',
      features: [
        'Fitur khusus sesuai bisnis Anda',
        'Pengguna unlimited',
        'Dukungan 24/7 dedicated',
        'Pelatihan tim gratis',
        'Integrasi sistem existing',
        'Custom report & dashboard',
      ],
      buttonText: 'Hubungi Kami',
      buttonClass: 'btn-outline',
      action: () => navigate('/contact'),
    },
  ];

  return (
    <div className="pricing-page-wrapper">
      {/* Floating decorative circles */}
      <div className="pricing-floating-circles">
        <div className="pricing-circle"></div>
        <div className="pricing-circle"></div>
        <div className="pricing-circle"></div>
        <div className="pricing-circle"></div>
        <div className="pricing-circle"></div>
      </div>
      
      <div className="pricing-page-content">
        <h1>Pilih Paket StockWatch yang Tepat</h1>
        <div className="pricing-intro">
          <p>
            Mulai kelola stok bisnis Anda dengan mudah dan profesional. 
            Pilih paket yang sesuai dengan kebutuhan dan budget UMKM Anda.
          </p>
          <span className="highlight-text">
            ✨ Tanpa biaya tersembunyi • Tanpa kontrak jangka panjang • Garansi 30 hari
          </span>
        </div>
        
        <div className="pricing-grid">
          {/* Loop melalui data paket dan render setiap kartu secara otomatis */}
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
              <div className="value-badge">{plan.badge}</div>
              <h3>{plan.type}</h3>
              <p className="price">{plan.price}</p>
              <span className="price-period">{plan.period}</span>
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className={`btn-pricing ${plan.buttonClass}`} onClick={plan.action}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
        
        {/* Trust indicators dengan styling yang lebih menarik */}
        <div className="trust-indicators">
          <p><span>🛡️</span> <strong>Garansi 30 hari uang kembali</strong></p>
          <p><span>🔐</span> <strong>Data aman & terenkripsi</strong></p>
          <p><span>💬</span> <strong>Dukungan pelanggan Indonesia</strong></p>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;