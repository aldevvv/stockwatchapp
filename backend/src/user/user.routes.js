import express from 'express';
import { getUserProfile, updateUserProfile } from './user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Semua rute di bawah ini akan dilindungi oleh authMiddleware
router.use(authMiddleware);

// Rute untuk mendapatkan profil pengguna
router.get('/profile', getUserProfile);

// Rute untuk mengupdate profil pengguna
router.put('/profile', updateUserProfile);

export default router;