import express from 'express';
import { createStok, getAllStok, updateStok, deleteStok } from './stok.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createStok);

router.get('/', getAllStok);

// Nanti kita tambahkan rute untuk Update dan Delete di sini
router.put('/:id', updateStok);
router.delete('/:id', deleteStok);

export default router;