import express from 'express';
import { handleContactForm } from './contact.controller.js';

console.log('Loading contact.routes.js');


const router = express.Router();

router.post('/', handleContactForm);

export default router;