import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getAdminStats);

export default router;
