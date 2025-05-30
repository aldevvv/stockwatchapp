import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // CSS khusus untuk Halaman Home

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Always in Stock, Always in Control</h1>
          <p className="hero-subtitle">
            StockWatch adalah solusi cerdas untuk monitoring inventaris UMKM, memungkinkan Anda melacak stok, mendapatkan notifikasi penting, dan membuat keputusan bisnis yang lebih baik, semuanya dalam satu platform yang mudah digunakan.
          </p>
          <Link to="/register" className="btn btn-primary hero-cta">Daftar Gratis Sekarang</Link>
          <Link to="/pricing" className="btn btn-secondary hero-cta">Lihat Paket Harga</Link>
        </div>
      </section>

      {/* Problem Introduction Section */}
      <section className="home-section problem-intro-section">
        <div className="container">
          <h2>Permasalahan Umum UMKM</h2>
          <div className="problem-points">
            <div className="point-item">
              <img src="https://www.qiscus.com/id/wp-content/uploads/sites/2/2021/12/kesalahan.jpg" alt="Stok Kosong" /> 
              {/* GANTI: Ilustrasi rak kosong atau pelanggan kecewa */}
              <h3>Kehilangan Pelanggan</h3>
              <p>Kehabisan barang saat dibutuhkan membuat pelanggan beralih ke kompetitor.</p>
            </div>
            <div className="point-item">
              <img src="https://storage.googleapis.com/finansialku_media/wordpress_media/2017/10/Definisi-Kredit-Adalah-01-Finansialku.jpg" alt="Modal Mati" />
              {/* GANTI: Ilustrasi tumpukan barang tidak terjual */}
              <h3>Modal Tidak Produktif</h3>
              <p>Stok berlebih atau barang lambat laku mengikat modal usaha Anda.</p>
            </div>
            <div className="point-item">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe1NRcFulTUxpr5h7Gd2JZisLXbgIo_pOI6Q&s" alt="Pencatatan Rumit" />
              {/* GANTI: Ilustrasi orang pusing dengan buku catatan */}
              <h3>Waktu Terbuang</h3>
              <p>Pencatatan manual yang memakan waktu dan rentan kesalahan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Introduction Section */}
      <section className="home-section solution-intro-section">
        <div className="container">
          <div className="two-column-layout">
            <div className="column-image">
              {/* GANTI: Screenshot aplikasi StockWatch yang menarik atau ilustrasi dashboard */}
              <img src="https://asset-2.tstatic.net/tribunnews/foto/bank/images/ilustrasi-manajemen-stok-barang.jpg" alt="Dashboard StockWatch" />
            </div>
            <div className="column-text">
              <h2>StockWatch - Kendali Penuh di Ujung Jari Anda</h2>
              <p>
                Ucapkan selamat tinggal pada kerumitan manajemen stok! StockWatch dirancang khusus untuk UMKM seperti Anda. Antarmuka yang intuitif, fitur notifikasi canggih, dan akses data real-time akan mengubah cara Anda mengelola inventaris.
              </p>
              <ul>
                <li>Pantau stok kapan saja, di mana saja.</li>
                <li>Dapatkan notifikasi otomatis via WhatsApp & Email.</li>
                <li>Buat keputusan pembelian yang lebih cerdas.</li>
              </ul>
              <Link to="/about" className="btn btn-outline-primary">Pelajari Lebih Lanjut</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="home-section key-features-section">
        <div className="container">
          <h2 className="section-title">Fitur Unggulan yang Memudahkan Hidup Anda</h2>
          <div className="features-grid-home">
            <div className="feature-card-home">
              {/* GANTI: Ikon untuk Dashboard */}
              <div className="feature-icon">📊</div> 
              <h3>Dashboard Real-time</h3>
              <p>Pantau semua pergerakan stok Anda secara langsung dalam satu layar informatif.</p>
            </div>
            <div className="feature-card-home">
              {/* GANTI: Ikon untuk Notifikasi */}
              <div className="feature-icon">🔔</div>
              <h3>Notifikasi Cerdas</h3>
              <p>Dapatkan peringatan instan jika stok menipis, langsung ke WhatsApp & Email Anda.</p>
            </div>
            <div className="feature-card-home">
              {/* GANTI: Ikon untuk Laporan */}
              <div className="feature-icon">📋</div>
              <h3>Riwayat & Laporan</h3>
              <p>Lacak histori stok dan dapatkan laporan untuk analisis bisnis yang lebih mendalam.</p>
            </div>
            <div className="feature-card-home">
              {/* GANTI: Ikon untuk Akses Mudah */}
              <div className="feature-icon">📱</div>
              <h3>Akses Mudah & Fleksibel</h3>
              <p>Gunakan di berbagai perangkat tanpa instalasi. Cukup buka browser!</p>
            </div>
          </div>
        </div>
      </section>


      {/* Final Call to Action Section */}
      <section className="home-section final-cta-section">
        <div className="container">
          <h2>Mulai Optimalkan Stok Bisnis Anda Hari Ini!</h2>
          <p>
            Jangan Biarkan Manajemen Stok Menghambat Pertumbuhan Bisnis Anda, Silahkan Coba StockWatch dan Rasakan Bedanya.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">Daftar Gratis Sekarang</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;