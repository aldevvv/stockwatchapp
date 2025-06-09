import express from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes.js';
import stokRoutes from './stok/stok.routes.js'; 
import userRoutes from './user/user.routes.js';
import './scheduler/index.js'; 
import laporanRoutes from './laporan/laporan.routes.js';
import supplierRoutes from './supplier/supplier.routes.js'; 
import adminRoutes from './admin/admin.routes.js'; 
import stockshareRoutes from './stockshare/stockshare.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stok', stokRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/suppliers', supplierRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/stockshare', stockshareRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API StockWatch Aktif!' });
});

app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});