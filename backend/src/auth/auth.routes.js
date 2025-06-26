import express from 'express';
import { 
    register, 
    login, 
    verifyEmail,
    requestPasswordReset,
    resetPassword
} from './auth.controller.js';

console.log('Loading auth.routes.js');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;