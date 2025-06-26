import express from 'express';
import { 
    createListing, 
    getAllListings, 
    getMyListings, 
    updateMyListing, 
    deleteMyListing 
} from './stockshare.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

console.log('Loading stockshare.routes.js');


const router = express.Router();

router.use(authMiddleware);

router.get('/listings', getAllListings);
router.get('/my-listings', getMyListings);
router.post('/list', createListing);
router.put('/listings/:listingId', updateMyListing);
router.delete('/listings/:listingId', deleteMyListing);

export default router;