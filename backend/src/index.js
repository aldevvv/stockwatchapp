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
import leaderboardRoutes from './leaderboard/leaderboard.routes.js';
import achievementRoutes from './achievements/achievement.routes.js';

const app = express();

const allowedOrigins = [
  'https://stockwatch.web.id',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to StockWatch API!'));

try {
  console.log('Mounting /api/auth');
  app.use('/api/auth', authRoutes);

  console.log('Mounting /api/users');
  app.use('/api/users', userRoutes);

  console.log('Mounting /api/stok');
  app.use('/api/stok', stokRoutes);

  console.log('Mounting /api/suppliers');
  app.use('/api/suppliers', supplierRoutes);

  console.log('Mounting /api/history');
  app.use('/api/history', historyRoutes);

  console.log('Mounting /api/produk');
  app.use('/api/produk', produkRoutes);

  console.log('Mounting /api/penjualan');
  app.use('/api/penjualan', penjualanRoutes);

  console.log('Mounting /api/stockshare');
  app.use('/api/stockshare', stockshareRoutes);

  console.log('Mounting /api/billing');
  app.use('/api/billing', billingRoutes);

  console.log('Mounting /api/admin');
  app.use('/api/admin', adminRoutes);

  console.log('Mounting /api/contact');
  app.use('/api/contact', contactRoutes);

  console.log('Mounting /api/leaderboard');
  app.use('/api/leaderboard', leaderboardRoutes);

  console.log('Mounting /api/achievements');
  app.use('/api/achievements', achievementRoutes);

} catch (err) {
  console.error('🔥 Error saat mounting route:', err);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeSchedulers(); // ini tidak kita ubah karena error bukan dari sini
});
