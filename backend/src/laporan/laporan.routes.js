// backend/src/laporan/laporan.routes.js
import express from 'express';
import { getRiwayatStokByItem } from './laporan.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Semua rute di bawah ini akan dilindungi oleh authMiddleware
router.use(authMiddleware);

// Rute untuk mendapatkan riwayat stok per item
// :itemId adalah parameter dinamis untuk ID barang
router.get('/stok/:itemId/riwayat', getRiwayatStokByItem);

export default router;