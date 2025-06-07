import express from 'express';
import { createListing, getAllListings } from './stockshare.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/list', createListing);
router.get('/listings', getAllListings);

export default router;