import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleContactForm } from './contact.controller.js';

const router = express.Router();

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: { message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', contactLimiter, handleContactForm);

export default router;