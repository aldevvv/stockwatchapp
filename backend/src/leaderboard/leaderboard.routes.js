import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getLeaderboard, triggerLeaderboardCalculation } from './leaderboard.controller.js';

console.log('Loading leaderboard.routes.js');


const router = express.Router();

router.get('/', authMiddleware, getLeaderboard);
router.post('/recalculate', authMiddleware, triggerLeaderboardCalculation);

export default router;