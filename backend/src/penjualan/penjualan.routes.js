import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createTransaksi, getAllTransaksi, getLaporanPenjualan } from './penjualan.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTransaksi);
router.get('/', getAllTransaksi);
router.get('/laporan', getLaporanPenjualan);

export default router;