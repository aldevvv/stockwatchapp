import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import initializeSchedulers from './scheduler/index.js';

import authRoutes from './auth/auth.routes.js';
import userRoutes from './user/user.routes.js';
import stokRoutes from './stok/stok.routes.js';
import supplierRoutes from './supplier/supplier.routes.js';
import historyRoutes from './history/history.routes.js';
import produkRoutes from './produk/produk.routes.js';
import penjualanRoutes from './penjualan/penjualan.routes.js';
import stockshareRoutes from './stockshare/stockshare.routes.js';
import billingRoutes from './billing/billing.routes.js';
import adminRoutes from './admin/admin.routes.js';
import contactRoutes from './contact/contact.routes.js';

const app = express();

// --- KONFIGURASI CORS BARU & LEBIH LENGKAP ---
const allowedOrigins = [
  'https://stockwatch.web.id', 
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan permintaan tanpa origin (seperti dari Postman atau server-ke-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Akses diblokir oleh kebijakan CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Aktifkan handler untuk preflight request di semua rute
app.options('*', cors(corsOptions)); 

// Terapkan CORS untuk semua permintaan lain
app.use(cors(corsOptions));
// --- AKHIR PERBAIKAN ---

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to StockWatch API!'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stok', stokRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/penjualan', penjualanRoutes);
app.use('/api/stockshare', stockshareRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    initializeSchedulers();
});