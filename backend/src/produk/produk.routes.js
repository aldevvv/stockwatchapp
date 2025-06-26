import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createProduk, getAllProduk, updateProduk, deleteProduk } from './produk.controller.js';
import { checkLimit } from '../middleware/checkLimit.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', authMiddleware, checkLimit('produk'), createProduk);
router.get('/', getAllProduk);
router.put('/:id', updateProduk);
router.delete('/:id', deleteProduk);

export default router;