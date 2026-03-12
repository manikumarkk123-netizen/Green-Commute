import express from 'express';
import { sendOtp, verifyOtp, sendWelcomeEmail, sendLoginAlert } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/send-welcome', sendWelcomeEmail);
router.post('/login-alert', sendLoginAlert);

export default router;
