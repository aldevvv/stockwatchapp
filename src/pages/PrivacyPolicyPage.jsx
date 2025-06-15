import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

function PrivacyPolicyPage() {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1>Kebijakan Privasi StockWatch</h1>
        <p className="last-updated">Tanggal Efektif: 10 Juni 2025</p>

        <p>StockWatch ("kami") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami.</p>

        <h2>Informasi yang Kami Kumpulkan</h2>
        <p>Kami mengumpulkan beberapa jenis informasi untuk menyediakan Layanan kami, termasuk:</p>
        <ul>
            <li><strong>Informasi Pendaftaran:</strong> Nama lengkap, nama toko, alamat email, dan nomor telepon (WhatsApp) yang Anda berikan.</li>
            <li><strong>Data Operasional:</strong> Data yang Anda masukkan, seperti nama barang, jumlah stok, harga beli, nama supplier, dan informasi listing di StockShare.</li>
            <li><strong>Data Riwayat:</strong> Catatan otomatis setiap perubahan pada data stok Anda untuk fitur laporan.</li>
            <li><strong>Foto Profil:</strong> File gambar yang Anda unggah sebagai foto profil atau logo toko.</li>
        </ul>

        <h2>Bagaimana Kami Menggunakan Informasi Anda</h2>
        <p>Data Anda kami gunakan untuk menyediakan fungsionalitas Layanan, mengautentikasi login, mengirim notifikasi transaksional, personalisasi pengalaman, dan memberikan dukungan pelanggan.</p>
        
        <h2>Pembagian Informasi</h2>
        <p>Kami tidak akan pernah menjual data pribadi Anda. Kami hanya membagikan informasi yang diperlukan kepada penyedia layanan pihak ketiga seperti SendGrid (untuk pengiriman email) untuk menjalankan fungsi notifikasi.</p>

        <h2>Akses Administrator</h2>
        <p>Perlu dicatat bahwa untuk tujuan dukungan pelanggan, pemecahan masalah teknis, dan memfasilitasi fitur, tim administrator StockWatch yang berwenang memiliki kemampuan teknis untuk mengakses data yang Anda masukkan, termasuk data stok dan profil Anda. Akses ini dilakukan dengan kebijakan internal yang ketat dan hanya jika benar-benar diperlukan.</p>

        <h2>Keamanan Data</h2>
        <p>Kami menerapkan langkah-langkah keamanan standar industri, termasuk koneksi HTTPS (SSL) dan enkripsi password (hashing), untuk melindungi data Anda.</p>

        <h2>Hak Anda</h2>
        <p>Anda memiliki kontrol penuh atas data Anda. Anda dapat mengakses, mengedit, atau menghapus data stok, supplier, dan akun Anda kapan saja melalui menu Pengaturan di dalam aplikasi.</p>

        <h2>Kontak</h2>
        <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <Link to="/hubungi-kami">Hubungi Kami</Link>.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;