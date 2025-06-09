import express from 'express';
import { createListing, getAllListings, getMyListings, updateMyListing, deleteMyListing } from './stockshare.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/list', createListing);
router.get('/listings', getAllListings);
router.get('/my-listings', getMyListings); 
router.put('/listings/:listingId', updateMyListing); 
router.delete('/listings/:listingId', deleteMyListing); 


export default router;