import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';
import { 
    getPlatformStats,
    getAllUsersProfiles,
    getUserDetailsForAdmin,
    addSaldoToUser,
    createRedeemCode,
    getAllRedeemCodes,
    updateRedeemCode,
    deleteRedeemCode,
    manageUserAccount
} from './admin.controller.js';

const router = express.Router();

router.use(authMiddleware, adminAuthMiddleware);

router.get('/stats', getPlatformStats);

router.get('/users', getAllUsersProfiles);
router.get('/users/:targetUserId/details', getUserDetailsForAdmin);
router.post('/users/add-saldo', addSaldoToUser);
router.put('/users/:targetUserId/manage', manageUserAccount);

router.post('/redeem-codes', createRedeemCode);
router.get('/redeem-codes', getAllRedeemCodes);
router.put('/redeem-codes/:codeId', updateRedeemCode);
router.delete('/redeem-codes/:codeId', deleteRedeemCode);

export default router;