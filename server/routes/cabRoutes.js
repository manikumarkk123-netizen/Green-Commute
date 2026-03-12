import express from 'express';
import { bookCab, getAvailability } from '../controllers/cabController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/availability', getAvailability);
router.post('/book', protect, bookCab);

export default router;
