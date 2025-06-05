import express from 'express';
import { 
    getAllUsersProfiles, 
    getUserStockForAdmin, 
    sendMessageToUser,
    getPlatformStats
} from './admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, adminAuthMiddleware, getPlatformStats);
router.get('/users', authMiddleware, adminAuthMiddleware, getAllUsersProfiles);
router.get('/users/:targetUserId/stok', authMiddleware, adminAuthMiddleware, getUserStockForAdmin);
router.post('/messages/send', authMiddleware, adminAuthMiddleware, sendMessageToUser);

export default router;