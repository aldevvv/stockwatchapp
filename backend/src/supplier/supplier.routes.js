import express from 'express';
import { 
    createSupplier, 
    getAllSuppliers, 
    updateSupplier, 
    deleteSupplier,
    deleteAllSuppliers
} from './supplier.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isOwner } from '../middleware/permissionMiddleware.js';
import { checkLimit } from '../middleware/checkLimit.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllSuppliers);
router.post('/', checkLimit('supplier'), createSupplier);
router.put('/:supplierId', updateSupplier);
router.delete('/all', isOwner, deleteAllSuppliers);
router.delete('/:supplierId', isOwner, deleteSupplier);

export default router;