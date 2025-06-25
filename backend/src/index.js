import express from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes.js';
import stokRoutes from './stok/stok.routes.js'; 
import userRoutes from './user/user.routes.js';
import initializeSchedulers from './scheduler/index.js';
import supplierRoutes from './supplier/supplier.routes.js'; 
import adminRoutes from './admin/admin.routes.js'; 
import stockshareRoutes from './stockshare/stockshare.routes.js';
import contactRoutes from './contact/contact.routes.js';
import historyRoutes from './history/history.routes.js'; // <-- PASTIKAN BARIS IMPOR INI ADA
import produkRoutes from './produk/produk.routes.js';
import penjualanRoutes from './penjualan/penjualan.routes.js';
import billingRoutes from './billing/billing.routes.js';
import achievementRoutes from './achievements/achievement.routes.js';
import leaderboardRoutes from './leaderboard/leaderboard.routes.js';





const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stok', stokRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes); 
app.use('/api/history', historyRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/stockshare', stockshareRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/penjualan', penjualanRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);







app.get('/', (req, res) => {
  res.status(200).json({ message: 'API StockWatch Aktif!' });
});

app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
  initializeSchedulers();

});