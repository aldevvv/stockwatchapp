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

console.log('Loading stok.routes.js');


const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllStok);
router.post('/', checkLimit('stok'), tambahStokItem);
router.put('/:itemId', updateStok);
router.delete('/all', deleteAllStok);
router.delete('/:itemId', deleteStok);

export default router;