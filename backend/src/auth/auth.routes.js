import express from 'express';
import { login, register, verifyEmail, requestPasswordReset, resetPassword } from './auth.controller.js'; 

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify-email/:token', verifyEmail); 
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);


export default router;