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
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
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
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    initializeSchedulers();
});