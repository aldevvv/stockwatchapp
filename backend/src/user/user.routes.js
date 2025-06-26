import express from 'express';
import { 
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    deleteCurrentUserAccount, 
    uploadProfilePicture,
    deactivateAccount 
} from './user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isOwner } from '../middleware/permissionMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/profile/change-password', changePassword);
router.post('/profile/upload-picture', upload.single('profilePicture'), uploadProfilePicture);
router.post('/deactivate', isOwner, deactivateAccount);
router.delete('/me', isOwner, deleteCurrentUserAccount);

export default router;
