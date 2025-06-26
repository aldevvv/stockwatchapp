import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createProduk, getAllProduk, updateProduk, deleteProduk } from './produk.controller.js';
import { isOwner } from '../middleware/permissionMiddleware.js';
import { checkLimit } from '../middleware/checkLimit.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllProduk);
router.post('/', checkLimit('produk'), createProduk);
router.put('/:id', updateProduk);
router.delete('/:id', isOwner, deleteProduk);

export default router;