import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

function TermsPage() {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1>Syarat & Ketentuan StockWatch</h1>
        <p className="last-updated">Tanggal Efektif: 10 Juni 2025</p>

        <p>Selamat datang di StockWatch! Dengan mendaftar atau menggunakan layanan kami ("Layanan"), Anda setuju untuk terikat oleh Syarat dan Ketentuan ("Ketentuan") ini.</p>

        <h2>1. Deskripsi Layanan</h2>
        <p>StockWatch adalah solusi manajemen stok berbasis web yang dirancang untuk membantu Usaha Mikro, Kecil, dan Menengah (UMKM) melacak inventaris, menerima notifikasi stok rendah secara otomatis, dan menganalisis pergerakan barang. Layanan kami juga mencakup fitur "StockShare", sebuah platform di mana pengguna dapat menawarkan surplus stok mereka kepada pengguna lain.</p>

        <h2>2. Akun Pengguna</h2>
        <ul>
          <li><strong>Pendaftaran:</strong> Anda setuju untuk memberikan informasi yang akurat dan lengkap saat mendaftar.</li>
          <li><strong>Keamanan:</strong> Anda bertanggung jawab penuh untuk menjaga kerahasiaan password Anda dan semua aktivitas yang terjadi di bawah akun Anda.</li>
          <li><strong>Usia:</strong> Anda harus berusia minimal 18 tahun untuk menggunakan Layanan ini.</li>
        </ul>

        <h2>3. Aturan Penggunaan Layanan</h2>
        <p>Anda setuju untuk tidak menyalahgunakan Layanan kami. Anda tidak akan menggunakan Layanan untuk tujuan ilegal, mencoba mengakses akun pengguna lain tanpa izin, atau mengganggu integritas server kami.</p>

        <h2>4. Fitur StockShare</h2>
        <p>StockWatch menyediakan fitur StockShare sebagai platform untuk memfasilitasi koneksi antar pengguna. StockWatch hanya bertindak sebagai fasilitator dan tidak terlibat dalam transaksi, negosiasi, pembayaran, atau pengiriman barang. Semua kesepakatan adalah tanggung jawab penuh antara pengguna penjual dan pembeli.</p>
        
        <h2>5. Pembatasan Tanggung Jawab</h2>
        <p>Layanan disediakan "sebagaimana adanya". Sejauh yang diizinkan oleh hukum, StockWatch tidak akan bertanggung jawab atas kehilangan data, kerugian bisnis, atau kerusakan tidak langsung lainnya yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan Layanan kami.</p>

        <h2>6. Penghentian Akun</h2>
        <p>Anda dapat menghapus akun Anda kapan saja melalui menu Pengaturan. Kami berhak untuk menangguhkan atau menghentikan akun Anda jika Anda terbukti melanggar Ketentuan ini.</p>
        
        <h2>7. Kontak</h2>
        <p>Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami melalui halaman <Link to="/hubungi-kami">Hubungi Kami</Link>.</p>
      </div>
    </div>
  );
}

export default TermsPage;