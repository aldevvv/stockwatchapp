import express from 'express';
import { 
    tambahStokItem, 
    getAllStok, 
    updateStok, 
    deleteStok, 
    deleteAllStok 
} from './stok.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isOwner } from '../middleware/permissionMiddleware.js';
import { checkLimit } from '../middleware/checkLimit.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllStok);
router.post('/', checkLimit('stok'), tambahStokItem);
router.put('/:itemId', updateStok);
router.delete('/all', isOwner, deleteAllStok);
router.delete('/:itemId', isOwner, deleteStok);

export default router;
