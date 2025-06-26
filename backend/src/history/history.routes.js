import express from 'express';
import { getHistory } from './history.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';


console.log('Loading history.routes.js');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getHistory);

export default router;