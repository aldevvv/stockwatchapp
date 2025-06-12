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
```
stockwatch-app/
├── .gitignore
├── README.md
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── admin.controller.js
│   │   │   └── admin.routes.js
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   ├── config/
│   │   │   ├── firebase.js
│   │   │   └── firebaseAdminSDK.json  (RAHASIA - Tidak di-commit)
│   │   ├── contact/
│   │   │   ├── contact.controller.js
│   │   │   └── contact.routes.js
│   │   ├── history/
│   │   │   ├── history.controller.js
│   │   │   └── history.routes.js
│   │   ├── middleware/
│   │   │   ├── adminAuthMiddleware.js
│   │   │   └── auth.middleware.js
│   │   ├── penjualan/
│   │   │   ├── penjualan.controller.js
│   │   │   └── penjualan.routes.js
│   │   ├── produk/
│   │   │   ├── produk.controller.js
│   │   │   └── produk.routes.js
│   │   ├── scheduler/
│   │   │   └── index.js
│   │   ├── services/
│   │   │   └── notification.service.js
│   │   ├── stockshare/
│   │   │   ├── stockshare.controller.js
│   │   │   └── stockshare.routes.js
│   │   ├── stok/
│   │   │   ├── stok.controller.js
│   │   │   └── stok.routes.js
│   │   ├── supplier/
│   │   │   ├── supplier.controller.js
│   │   │   └── supplier.routes.js
│   │   └── user/
│   │       ├── user.controller.js
│   │       └── user.routes.js
│   ├── .env                       (RAHASIA - Tidak di-commit)
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── node_modules/
    ├── public/
    │   ├── Logo.png
    │   ├── favicon.png
    │   └── StockWatchLogo.svg
    └── src/
        ├── assets/
        ├── auth/
        │   ├── LoginPage.jsx & .css
        │   ├── RegisterPage.jsx & .css
        │   ├── RequestPasswordResetPage.jsx & .css
        │   ├── ResetPasswordPage.jsx & .css
        │   ├── VerifyEmailPage.jsx & .css
        │   └── authService.js
        ├── components/
        │   ├── common/
        │   │   └── AccordionItem.jsx
        │   └── layout/
        │       ├── AdminLayout.jsx, AdminSidebar.jsx, AdminNavbar.jsx, ...
        │       ├── DashboardLayout.jsx & .css
        │       ├── DashboardNavbar.jsx & .css
        │       ├── LandingFooter.jsx & .css
        │       ├── LandingNavbar.jsx & .css
        │       ├── ProfileDropdown.jsx
        │       ├── PublicLayout.jsx
        │       └── Sidebar.jsx & .css
        │   └── Modal.jsx & .css
        ├── contact/
        │   └── contactService.js
        ├── context/
        │   └── AuthContext.js
        ├── dashboard/
        │   ├── ItemValueChart.jsx
        │   └── StockDashboardPage.jsx & .css
        ├── history/
        │   ├── StockHistoryPage.jsx
        │   └── historyService.js
        ├── pages/
        │   ├── AboutPage.jsx & .css
        │   ├── ContactPage.jsx & .css
        │   ├── FAQPage.jsx & .css
        │   ├── HomePage.jsx & .css
        │   ├── LegalPage.css
        │   ├── PricingPage.jsx & .css
        │   ├── PrivacyPolicyPage.jsx
        │   ├── TermsPage.jsx
        │   └── TestimonialsPage.jsx & .css
        ├── penjualan/
        │   ├── LaporanPenjualanPage.css
        │   ├── PenjualanHariIniPage.jsx & .css
        │   ├── PosPage.jsx & .css
        │   ├── RiwayatPenjualanPage.jsx & .css
        │   └── penjualanService.js
        ├── produk/
        │   ├── ProdukForm.jsx & .css
        │   ├── ProdukPage.jsx
        │   └── produkService.js
        ├── services/
        │   └── api.js
        ├── stockshare/
        │   ├── ListStokForm.jsx & .css
        │   ├── ListingCard.jsx
        │   ├── StockSharePage.jsx & .css
        │   └── stockshareService.js
        ├── stok/
        │   ├── StockListPage.jsx & .css
        │   ├── StokForm.jsx & .css
        │   └── stokService.js
        ├── styles/
        │   └── DashboardPages.css
        ├── supplier/
        │   ├── SupplierForm.jsx & .css
        │   ├── SupplierListPage.jsx & .css
        │   └── supplierService.js
        ├── user/
        │   ├── PengaturanPage.jsx & .css
        │   └── userService.js
        ├── utils/
        │   ├── toastHelper.js
        │   └── unitOptions.js
        ├── App.jsx
        ├── index.css
        └── main.jsx
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js

```

---

# Panduan Lengkap Deploy Aplikasi Full-Stack StockWatch

Dokumen ini berisi panduan step-by-step untuk mendeploy aplikasi StockWatch (Frontend React/Vite dan Backend Node.js/Express) di server VPS baru yang menggunakan sistem operasi Ubuntu.

---

## Prasyarat

Sebelum memulai, pastikan Anda sudah memiliki:
1.  **Akses VPS:** Alamat IP, username `root`, dan password.
2.  **Nama Domain:** Nama domain yang sudah Anda beli.
3.  **Akses DNS Domain:** Bisa login ke dashboard penyedia domain untuk mengatur DNS.
4.  **Repository GitHub:** Kode proyek terbaru sudah di-push ke repository.
5.  **File Kredensial Lokal:** Siapkan isi file `backend/.env` dan `backend/src/config/firebaseAdminSDK.json` dari komputer Anda.

---

## Fase 1: Setup Awal & Keamanan Server

*Semua perintah di fase ini dijalankan di terminal VPS setelah login sebagai `root`.*

1.  **Login ke VPS sebagai `root`:**
    ```bash
    ssh root@ALAMAT_IP_VPS_ANDA
    ```

2.  **Buat User Baru (Non-root):**
    *Ganti `NAMA_USER_BARU` dengan username pilihan Anda (misalnya, `aldev`).*
    ```bash
    adduser NAMA_USER_BARU
    ```
    (Ikuti instruksi untuk membuat password baru).

3.  **Berikan Hak Akses `sudo`:**
    ```bash
    usermod -aG sudo NAMA_USER_BARU
    ```

4.  **Konfigurasi Firewall Dasar (UFW):**
    ```bash
    sudo ufw allow OpenSSH
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw enable
    ```
    (Ketik `y` dan `Enter` untuk konfirmasi).

5.  **Logout dan Login Kembali dengan User Baru:**
    ```bash
    exit
    ```
    ```bash
    ssh NAMA_USER_BARU@ALAMAT_IP_VPS_ANDA
    ```
    *(Mulai sekarang, semua perintah akan dijalankan sebagai user baru ini).*

---

## Fase 2: Instalasi Perangkat Lunak Inti

*(Semua perintah di fase ini dijalankan di terminal VPS sebagai user baru Anda).*

1.  **Update Sistem:**
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2.  **Install Node.js (v20.x) dan npm:**
    ```bash
    curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
    Verifikasi dengan: `node -v` dan `npm -v`.

3.  **Install Git:**
    ```bash
    sudo apt-get install -y git
    ```

4.  **Install PM2 (Process Manager):**
    ```bash
    sudo npm install pm2@latest -g
    ```

5.  **Install Nginx (Web Server):**
    ```bash
    sudo apt-get install -y nginx
    ```

---

## Fase 3: Deploy Kode & Konfigurasi Backend

*(Semua perintah di fase ini dijalankan di terminal VPS).*

1.  **Clone Repository dari GitHub:**
    *Navigasi ke direktori home (`cd ~`).*
    ```bash
    git clone [https://github.com/NAMA_USER_GITHUB/NAMA_REPO.git](https://github.com/NAMA_USER_GITHUB/NAMA_REPO.git) stockwatch-app
    ```
    (Masukkan username dan Personal Access Token GitHub Anda saat diminta).

2.  **Install Dependensi Backend:**
    ```bash
    cd ~/stockwatch-app/backend
    npm install
    ```

3.  **Buat File Konfigurasi Rahasia:**
    * **File `.env`:**
        ```bash
        nano .env
        ```
        (Salin-tempel seluruh isi file `.env` dari laptop Anda, lalu simpan dengan `Ctrl+O` dan keluar dengan `Ctrl+X`).
    * **File `firebaseAdminSDK.json`:**
        ```bash
        nano src/config/firebaseAdminSDK.json
        ```
        (Salin-tempel seluruh isi file JSON kunci Firebase Anda, lalu simpan dan keluar).

4.  **Buat File Konfigurasi PM2:**
    ```bash
    nano ecosystem.config.cjs
    ```
    Isi dengan kode berikut, lalu simpan dan keluar:
    ```javascript
    module.exports = {
      apps: [
        {
          name: 'StockWatch-API',
          script: 'src/index.js',
          node_args: '-r dotenv/config',
          env: {
            NODE_ENV: 'production',
          },
        },
      ],
    };
    ```

5.  **Jalankan Backend dengan PM2:**
    ```bash
    pm2 start ecosystem.config.cjs
    ```
    Verifikasi dengan `pm2 list`.

6.  **Atur PM2 agar Berjalan Saat Server Reboot:**
    ```bash
    pm2 startup
    ```
    (Salin dan jalankan perintah yang dihasilkan oleh `pm2 startup`).
    ```bash
    pm2 save
    ```

---

## Fase 4: Deploy Kode Frontend

**A. Di Laptop Anda:**
1.  **Buat/Perbarui file `frontend/.env.production`:** Isi dengan:
    `VITE_API_BASE_URL=https://domain-anda.com/api`
    *(Ganti `domain-anda.com` dengan domain Anda).*
2.  **Build Ulang Frontend:**
    ```bash
    # Masuk ke folder frontend di laptop Anda
    cd path/to/stockwatch-app/frontend
    rm -rf dist  # Hapus folder dist lama (di macOS/Linux)
    npm run build
    ```
3.  **Unggah folder `dist` baru ke VPS:**
    ```powershell
    # Di terminal laptop Anda (CMD/PowerShell)
    scp -r "C:\path\ke\proyek\anda\frontend\dist" NAMA_USER_BARU@ALAMAT_IP_VPS_ANDA:~/stockwatch-app/frontend/
    ```

**B. Di VPS Anda:**
1.  **Setel Izin untuk Folder `dist` yang Baru Diunggah:**
    ```bash
    sudo find ~/stockwatch-app/frontend/dist -type d -exec chmod 755 {} \;
    sudo find ~/stockwatch-app/frontend/dist -type f -exec chmod 644 {} \;
    ```

---

## Fase 5: Konfigurasi Nginx sebagai Reverse Proxy

*(Semua perintah di fase ini dijalankan di terminal VPS).*

1.  **Buat File Konfigurasi Nginx:**
    ```bash
    sudo nano /etc/nginx/sites-available/stockwatchapp
    ```
    Isi dengan kode berikut (ganti placeholder `domain-anda.com` dan `NAMA_USER_BARU`):
    ```nginx
    server {
        listen 80;
        listen [::]:80;
    
        server_name domain-anda.com [www.domain-anda.com](https://www.domain-anda.com);
    
        root /home/NAMA_USER_BARU/stockwatch-app/frontend/dist;
        index index.html;
    
        location / {
            try_files $uri /index.html =404;
        }
    
        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
2.  **Aktifkan Konfigurasi & Restart Nginx:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/stockwatchapp /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

## Fase 6: Mengamankan dengan HTTPS (Let's Encrypt)

*(Semua perintah di fase ini dijalankan di terminal VPS, dan pastikan DNS domain sudah mengarah ke IP VPS).*

1.  **Install Certbot:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```
2.  **Dapatkan Sertifikat SSL (ganti dengan domain Anda):**
    ```bash
    sudo certbot --nginx -d domain-anda.com -d [www.domain-anda.com](https://www.domain-anda.com)
    ```
    (Ikuti instruksi di layar, masukkan email, setujui ToS, dan pilih untuk me-redirect HTTP ke HTTPS).

---
## Fase 7: Verifikasi Akhir

Buka browser Anda dan akses **`https://domain-anda.com`**. Lakukan pengujian menyeluruh pada semua fitur.

---
## Alur Kerja untuk Update Selanjutnya

Setiap kali Anda ingin mengupdate aplikasi Anda dengan kode baru:

1.  **Di Laptop Anda:**
    * Lakukan perubahan kode.
    * `git add .`, `git commit`, `git push origin main`.
    * Jika ada perubahan di frontend, jalankan `npm run build` di folder `frontend/`.

2.  **Di VPS Anda:**
    * **Update Backend:**
      ```bash
      cd ~/stockwatch-app
      git pull origin main
      cd backend
      npm install # Jika ada dependensi baru
      pm2 restart StockWatch-API # Gunakan nama proses dari ecosystem file
      ```
    * **Update Frontend:**
      * Hapus `dist` lama di VPS: `rm -rf ~/stockwatch-app/frontend/dist`.
      * Unggah `dist` baru dari laptop menggunakan `scp`.
      * Setel ulang izinnya dengan perintah `find` seperti di Fase 4.
      * Restart Nginx (opsional, tapi disarankan): `sudo systemctl restart nginx`.

## Tim Pengembang (P2MW Universitas Negeri Makassar)
* Sukaina Ilham - Product Owner & UX Strategist [cite: 6]
* Muh Alif - Web Developer & Automation [cite: 6]
* Rejekki Manalu - UI/UX Designer [cite: 6]
* Ilfa El Zahra - Marketing & Edukasi [cite: 6]
* Muh Fathir - CS & Onboarding Trainer [cite: 6]

## Lisensi
Coming Soon
---
