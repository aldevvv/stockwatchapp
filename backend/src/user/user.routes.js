import express from 'express';
import multer from 'multer'; // <-- Impor multer
import { getUserProfile, updateUserProfile, changePassword, deleteCurrentUserAccount, uploadProfilePicture } from './user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/profile/change-password', changePassword);
router.post('/profile/upload-picture', upload.single('profilePicture'), uploadProfilePicture);
router.delete('/me', authMiddleware, deleteCurrentUserAccount);

export default router;