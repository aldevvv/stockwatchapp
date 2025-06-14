import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { redeemCode, getSaldoHistory, upgradePlan, getPlanDetails } from './billing.controller.js';

const router = express.Router();

router.get('/plans', getPlanDetails);

router.use(authMiddleware);

router.post('/redeem', redeemCode);
router.get('/history', getSaldoHistory);
router.post('/upgrade', upgradePlan);

export default router;