import express from 'express';
import { 
    tambahStokItem, 
    getAllStok, 
    updateJumlahStok, 
    updateDetailStokItem, 
    hapusStokItem 
} from './stok.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', tambahStokItem);
router.get('/', getAllStok);
router.put('/:itemId/jumlah', updateJumlahStok); // Khusus update jumlah
router.put('/:itemId/detail', updateDetailStokItem); // Khusus update detail non-jumlah
router.delete('/:itemId', hapusStokItem);

export default router;