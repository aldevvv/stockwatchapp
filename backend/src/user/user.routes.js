import express from 'express';
import { getUserProfile, updateUserProfile, changePassword } from './user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/profile/change-password', changePassword);

export default router;