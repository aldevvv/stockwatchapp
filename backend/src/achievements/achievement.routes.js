import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getAchievementsStatus } from './achievement.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getAchievementsStatus);

export default router;