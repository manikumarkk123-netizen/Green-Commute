import express from 'express';
import { createTrip, getUserTrips, getTripStats, calculateCarbon } from '../controllers/tripController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);
router.get('/stats', protect, getTripStats);
router.post('/calculate-carbon', calculateCarbon);

export default router;
