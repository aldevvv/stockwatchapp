import express from 'express';
import { 
    createSupplier, 
    getAllSuppliers, 
    updateSupplier, 
    deleteSupplier,
    deleteAllSuppliers
} from './supplier.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkLimit } from '../middleware/checkLimit.middleware.js';

console.log('Loading supplier.routes.js');


const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllSuppliers);
router.post('/', checkLimit('supplier'), createSupplier);
router.put('/:supplierId', updateSupplier);
router.delete('/all', deleteAllSuppliers);
router.delete('/:supplierId', deleteSupplier);

export default router;