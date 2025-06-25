import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getLeaderboard, triggerLeaderboardCalculation } from './leaderboard.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getLeaderboard);
router.post('/recalculate', triggerLeaderboardCalculation);

export default router;