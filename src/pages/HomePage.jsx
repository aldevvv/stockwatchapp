import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';


function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Always in Stock, Always in Control</h1>
          <p className="hero-subtitle">
            StockWatch adalah solusi cerdas untuk monitoring inventaris UMKM. Pantau stok, dapatkan notifikasi penting, dan buat keputusan bisnis yang tepat dalam satu platform yang mudah digunakan.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary hero-cta">
              Mulai Gratis Sekarang
            </Link>
            <Link to="/pricing" className="btn btn-secondary hero-cta">
              Lihat Paket Harga
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Introduction Section */}
      <section className="home-section problem-intro-section">
        <div className="container">
          <h2 className="section-title">Masalah Yang Sering Dialami UMKM</h2>
          <div className="problem-points">
            <div className="point-item">
              <img 
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Pelanggan kecewa karena stok kosong" 
              />
              <h3>Kehilangan Pelanggan</h3>
              <p>Kehabisan barang saat dibutuhkan membuat pelanggan kecewa dan beralih ke kompetitor lain.</p>
            </div>
            <div className="point-item">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Barang menumpuk tidak terjual" 
              />
              <h3>Modal Tidak Produktif</h3>
              <p>Stok berlebih atau barang yang lambat laku mengikat modal usaha dan mengurangi keuntungan.</p>
            </div>
            <div className="point-item">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Pencatatan manual yang rumit" 
              />
              <h3>Waktu Terbuang Sia-Sia</h3>
              <p>Pencatatan manual yang memakan waktu lama dan sering terjadi kesalahan dalam perhitungan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Introduction Section */}
      <section className="home-section solution-intro-section">
        <div className="container">
          <div className="two-column-layout">
            <div className="column-image">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Dashboard StockWatch yang mudah digunakan" 
              />
            </div>
            <div className="column-text">
              <h2>StockWatch - Solusi Tepat untuk UMKM</h2>
              <p>
                Kelola inventaris dengan mudah dan efisien! StockWatch dirancang khusus untuk kebutuhan UMKM dengan antarmuka yang sederhana namun powerful. Tidak perlu keahlian teknis khusus untuk menggunakannya.
              </p>
              <ul>
                <li>Pantau stok real-time kapan saja, di mana saja</li>
                <li>Notifikasi otomatis via WhatsApp dan Email</li>
                <li>Laporan lengkap untuk analisis bisnis</li>
                <li>Interface sederhana dan mudah dipahami</li>
              </ul>
              <Link to="/about" className="btn btn-outline-primary">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="home-section key-features-section">
        <div className="container">
          <h2 className="section-title">Fitur Unggulan StockWatch</h2>
          <div className="features-grid-home">
            <div className="feature-card-home">
              <div className="feature-icon">📊</div>
              <h3>Dashboard Sederhana</h3>
              <p>Lihat semua informasi stok penting dalam satu layar yang mudah dipahami dan tidak membingungkan.</p>
            </div>
            <div className="feature-card-home">
              <div className="feature-icon">🔔</div>
              <h3>Peringatan Otomatis</h3>
              <p>Dapatkan notifikasi langsung ke WhatsApp atau Email ketika stok hampir habis atau sudah kosong.</p>
            </div>
            <div className="feature-card-home">
              <div className="feature-icon">📱</div>
              <h3>Akses Kapan Saja</h3>
              <p>Gunakan di HP, tablet, atau komputer. Tidak perlu install aplikasi, cukup buka di browser.</p>
            </div>
            <div className="feature-card-home">
              <div className="feature-icon">📋</div>
              <h3>Laporan Lengkap</h3>
              <p>Riwayat stok dan laporan otomatis untuk membantu menganalisis penjualan dan kebutuhan stok.</p>
            </div>
                       <div className="feature-card-home">
              <div className="feature-icon">🤝</div>
              <h3>StockShare</h3>
              <p>Bagikan data stok dengan tim dan supplier untuk koordinasi yang lebih baik dalam supply chain</p>
            </div>
                       <div className="feature-card-home">
              <div className="feature-icon">📈</div>
              <h3>Analisis Trend</h3>
              <p>Pantau trend penjualan dan prediksi kebutuhan stok untuk perencanaan bisnis yang lebih akurat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="home-section final-cta-section">
        <div className="container">
          <h2>Siap Tingkatkan Bisnis Anda?</h2>
          <p>
            Bergabunglah dengan ribuan UMKM yang sudah merasakan kemudahan mengelola stok dengan StockWatch. Daftar sekarang dan rasakan bedanya!
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Daftar Gratis Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;