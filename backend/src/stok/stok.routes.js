import express from 'express';
import { 
    tambahStokItem, 
    getAllStok, 
    updateStok, 
    deleteStok, 
    deleteAllStok 
} from './stok.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkLimit } from '../middleware/checkLimit.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getAllStok);
router.post('/', authMiddleware, checkLimit('stok'), tambahStokItem);
router.delete('/all', deleteAllStok);
router.put('/:itemId', updateStok);
router.delete('/:itemId', deleteStok);

export default router;