// backend/src/supplier/supplier.routes.js
import express from 'express';
import { createSupplier, getAllSuppliers, updateSupplier, deleteSupplier } from './supplier.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Semua rute supplier akan menggunakan authMiddleware
router.use(authMiddleware);

router.post('/', createSupplier);        // POST /api/suppliers
router.get('/', getAllSuppliers);         // GET  /api/suppliers
router.put('/:supplierId', updateSupplier); // PUT  /api/suppliers/:supplierId
router.delete('/:supplierId', deleteSupplier); // DELETE /api/suppliers/:supplierId

export default router;