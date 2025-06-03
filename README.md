# StockWatch - Solusi Manajemen Stok Cerdas untuk UMKM

![StockWatch Logo Placeholder](https://pkwu100.my.canva.site/sukainailham/_assets/media/556e3ee73094232b6ff1f0e84ff1035a.png)
StockWatch adalah aplikasi web yang dirancang untuk membantu Usaha Mikro, Kecil, dan Menengah (UMKM) dalam memonitor dan mengelola inventaris barang mereka secara efisien. Dengan fitur notifikasi otomatis dan antarmuka yang mudah digunakan, StockWatch bertujuan untuk memberdayakan UMKM agar dapat mengurangi kerugian akibat manajemen stok yang kurang optimal dan fokus pada pengembangan bisnis.

Proyek ini dikembangkan sebagai bagian dari Program Pembinaan Mahasiswa Wirausaha (P2MW) Universitas Negeri Makassar.

## Fitur Utama

* **Dashboard Real-time:** Pantau jumlah, status, dan batas minimum stok barang secara langsung. [cite: 2]
* **Notifikasi Stok Otomatis:** Dapatkan peringatan instan via WhatsApp dan Email jika jumlah stok barang mencapai batas minimum yang telah ditentukan. [cite: 2]
* **Manajemen Stok (CRUD):** Tambah, lihat, ubah, dan hapus data item stok dengan mudah.
* **Pengaturan Batas Minimum Kustom:** Pengguna dapat mengatur sendiri batas minimum untuk setiap produk. [cite: 2]
* **Sistem Autentikasi Lengkap:**
    * Registrasi pengguna baru dengan pengecekan keunikan email dan nomor WhatsApp.
    * Verifikasi email saat registrasi.
    * Login pengguna dengan email dan password yang di-hash.
    * Fitur "Lupa Password" dengan pengiriman link reset via email.
    * Manajemen sesi menggunakan JSON Web Tokens (JWT). [cite: 1]
* **Manajemen Profil Pengguna:** Pengguna dapat mengatur email dan nomor WhatsApp tujuan notifikasi mereka.
* **Akses Multi-Perangkat:** Dapat diakses melalui browser di desktop, tablet, maupun smartphone tanpa perlu instalasi. [cite: 1, 2]
* **Landing Page Informatif:** Menyajikan informasi tentang StockWatch, fitur, harga (rencana), dan testimoni.

## Tech Stack

### Frontend (Sisi Klien)
* **React.js (dengan Vite):** Library JavaScript untuk membangun antarmuka pengguna. [cite: 1]
* **React Router DOM:** Untuk navigasi dan routing.
* **Axios:** Untuk HTTP client ke API backend.
* **Chart.js (`react-chartjs-2`):** Untuk visualisasi data di dashboard.
* **CSS3:** Untuk styling dan desain responsif. [cite: 1]

### Backend (Sisi Server)
* **Node.js:** Lingkungan eksekusi JavaScript. [cite: 1]
* **Express.js:** Framework untuk membangun API.
* **Firebase Realtime Database:** Database NoSQL cloud untuk data pengguna dan stok barang. [cite: 1]
* **JSON Web Tokens (JWT):** Untuk sistem autentikasi dan otorisasi. [cite: 1]
* **`bcryptjs`:** Untuk hashing password.
* **`node-cron`:** Untuk scheduler pengecekan stok otomatis.
* **Meta WhatsApp Business Platform API:** Untuk pengiriman notifikasi WhatsApp. [cite: 1]
* **Nodemailer:** Untuk pengiriman notifikasi Email dan email verifikasi/reset password. [cite: 1]
* **`dotenv`:** Untuk manajemen environment variables.

### Tools & Platform
* **Git & GitHub:** Version control.
* **Firebase Console:** Manajemen database. [cite: 1]
* **Meta Developer Portal & WhatsApp Manager:** Konfigurasi WhatsApp API.
* **Postman/API Client:** Pengujian API backend.
* **VSCode:** Editor kode.

## Struktur Proyek (Monorepo)
```stockwatch-app/
├── backend/                # Proyek Backend (Node.js/Express)
│   ├── .env.example        # Contoh variabel lingkungan backend
│   ├── package.json
│   └── src/
│       ├── auth/           # Modul autentikasi (controller, routes)
│       ├── config/         # Konfigurasi (Firebase)
│       ├── middleware/     # Middleware (authMiddleware)
│       ├── services/       # Layanan (notifikasi, email)
│       ├── stok/           # Modul manajemen stok (controller, routes)
│       ├── user/           # Modul manajemen profil user (controller, routes)
│       ├── scheduler/      # Logika penjadwalan notifikasi
│       └── index.js        # Entry point server backend
│
├── frontend/               # Proyek Frontend (React/Vite)
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── assets/         # Gambar, ikon, dll.
│       ├── components/     # Komponen UI reusable (Modal, Layout, dll.)
│       ├── context/        # React Context (AuthContext)
│       ├── services/       # Layanan API terpusat (api.js)
│       ├── pages/          # Komponen halaman landing page (HomePage, AboutPage, dll.)
│       ├── auth/           # Halaman & logika autentikasi (LoginPage, RegisterPage, dll.)
│       ├── dashboard/      # Halaman & komponen dashboard (DashboardPage, StokBarChart)
│       ├── stok/           # Komponen terkait stok (StokForm, stokService.js)
│       ├── user/           # Halaman & logika profil user (ProfilePage, userService.js)
│       ├── App.jsx         # Konfigurasi routing utama
│       └── main.jsx        # Entry point aplikasi React
│
├── .gitignore              # File dan folder yang diabaikan Git
└── README.md               # Informasi proyek ini
```

---


## Instalasi & Setup (Untuk Developer)

### Prasyarat
* Node.js (v18 atau lebih baru direkomendasikan)
* NPM atau Yarn
* Akun Firebase & buat Realtime Database [cite: 1]
* Akun Meta Developer & setup WhatsApp Business Platform API (termasuk nomor telepon bisnis dan message template yang disetujui) [cite: 1]
* Akun Email (misalnya Gmail dengan App Password) untuk layanan SMTP Nodemailer [cite: 1]

### Backend Setup
1.  Navigasi ke direktori `backend`: `cd backend`
2.  Salin `.env.example` menjadi `.env`: `cp .env.example .env` (atau buat manual di Windows)
3.  Isi semua variabel yang dibutuhkan di file `.env` (kunci API, URL database, kredensial email, dll.).
4.  Unduh file `firebaseAdminSDK.json` dari Firebase project settings (Service Accounts) dan letakkan di `backend/src/config/`.
5.  Install dependensi: `npm install` (atau `yarn install`)
6.  Jalankan server development: `npm run dev`
    Server akan berjalan di `http://localhost:5000` (atau port yang Anda definisikan).

### Frontend Setup
1.  Navigasi ke direktori `frontend`: `cd frontend`
2.  Buat file `.env` (jika ada konfigurasi frontend yang perlu variabel lingkungan, contoh: `VITE_API_BASE_URL=http://localhost:5000/api`).
3.  Install dependensi: `npm install` (atau `yarn install`)
4.  Jalankan server development: `npm run dev`
    Aplikasi akan terbuka di `http://localhost:5173` (atau port lain yang ditampilkan).


## Tim Pengembang (P2MW Universitas Negeri Makassar)
* Sukaina Ilham - Product Owner & UX Strategist [cite: 6]
* Muh Alif - Web Developer & Automation [cite: 6]
* Rejekki Manalu - UI/UX Designer [cite: 6]
* Ilfa El Zahra - Marketing & Edukasi [cite: 6]
* Muh Fathir - CS & Onboarding Trainer [cite: 6]

## Lisensi
Coming Soon
---
