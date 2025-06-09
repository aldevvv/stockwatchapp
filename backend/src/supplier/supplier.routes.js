import express from 'express';
import { 
    createSupplier, 
    getAllSuppliers, 
    updateSupplier, 
    deleteSupplier,
    deleteAllSuppliers
} from './supplier.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createSupplier);
router.get('/', getAllSuppliers);
router.delete('/all', deleteAllSuppliers); 
router.put('/:supplierId', updateSupplier);
router.delete('/:supplierId', deleteSupplier);

export default router;