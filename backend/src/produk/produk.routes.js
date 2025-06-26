import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createProduk, getAllProduk, updateProduk, deleteProduk } from './produk.controller.js';
import { checkLimit } from '../middleware/checkLimit.middleware.js';

console.log('Loading produk.routes.js');


const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllProduk);
router.post('/', checkLimit('produk'), createProduk);
router.put('/:id', updateProduk);
router.delete('/:id', deleteProduk);

export default router;