import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { getIsConnected } from '../config/db.js';

// Emission factors (kg CO₂ per km)
const EMISSION_FACTORS = {
  'Electric Scooter': 0.005,
  'Bike': 0.008,
  'EV Cab': 0.02,
  'Electric Bus': 0.03,
  'Carpool': 0.04,
  'Walk/Cycle': 0.0,
};

// Regular vehicle baseline (kg CO₂ per km)
const BASELINE_EMISSION = 0.21; // Average petrol car

// EcoCoin rewards per vehicle type
const ECOIN_REWARDS = {
  'Electric Scooter': 10,
  'Bike': 8,
  'EV Cab': 6,
  'Electric Bus': 5,
  'Carpool': 12,
  'Walk/Cycle': 15,
};

// Price per km per vehicle type (₹)
const PRICE_PER_KM = {
  'Electric Scooter': 7,
  'Bike': 5,
  'EV Cab': 14,
  'Electric Bus': 3,
  'Carpool': 8,
  'Walk/Cycle': 0,
};

// In-memory mock trips
const mockTrips = [];

// @POST /api/trips (protected)
export const createTrip = async (req, res) => {
  try {
    const { pickup, destination, vehicleType, distance } = req.body;

    if (!pickup || !destination || !vehicleType || !distance) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emissionFactor = EMISSION_FACTORS[vehicleType] || 0.02;
    const carbonSaved = parseFloat(((BASELINE_EMISSION - emissionFactor) * distance).toFixed(2));
    const baseCoins = ECOIN_REWARDS[vehicleType] || 5;
    const ecoCoinsEarned = Math.round(baseCoins * (distance / 5));
    const pricePerKm = PRICE_PER_KM[vehicleType] || 10;
    const price = Math.round(pricePerKm * distance + 20);

    if (!getIsConnected()) {
      const mockTrip = {
        _id: 'trip_' + Date.now(),
        userId: req.user.id,
        pickup, destination, vehicleType, distance, price,
        carbonSaved: Math.max(0, carbonSaved),
        ecoCoinsEarned,
        createdAt: new Date().toISOString(),
      };
      mockTrips.push(mockTrip);
      return res.status(201).json({ success: true, trip: mockTrip, ecoCoinsEarned, carbonSaved: Math.max(0, carbonSaved) });
    }

    const trip = await Trip.create({
      userId: req.user.id,
      pickup, destination, vehicleType, distance, price,
      carbonSaved: Math.max(0, carbonSaved),
      ecoCoinsEarned,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        totalTrips: 1,
        totalDistance: distance,
        carbonSaved: Math.max(0, carbonSaved),
        ecoCoins: ecoCoinsEarned,
      },
    });

    res.status(201).json({ success: true, trip, ecoCoinsEarned, carbonSaved: Math.max(0, carbonSaved) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/trips (protected)
export const getUserTrips = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const userTrips = mockTrips.filter(t => t.userId === req.user.id);
      return res.json({ success: true, trips: userTrips.reverse() });
    }

    const { filter } = req.query;
    let dateFilter = {};
    const now = new Date();
    if (filter === 'today') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } };
    } else if (filter === 'week') {
      const start = new Date(now); start.setDate(now.getDate() - now.getDay()); start.setHours(0,0,0,0);
      dateFilter = { createdAt: { $gte: start } };
    } else if (filter === 'month') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    }

    const trips = await Trip.find({ userId: req.user.id, ...dateFilter }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/trips/stats (protected)
export const getTripStats = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({
        success: true,
        stats: { totalTrips: 0, totalDistance: 0, carbonSaved: 0, ecoCoins: 0 },
        chartData: [],
      });
    }

    const user = await User.findById(req.user.id).select('totalTrips totalDistance carbonSaved ecoCoins');
    const monthlyStats = await Trip.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: { $month: '$createdAt' }, trips: { $sum: 1 }, distance: { $sum: '$distance' }, carbonSaved: { $sum: '$carbonSaved' }, ecoCoins: { $sum: '$ecoCoinsEarned' } } },
      { $sort: { _id: 1 } },
    ]);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = months.map((month, idx) => {
      const stat = monthlyStats.find(s => s._id === idx + 1) || {};
      return { month, trips: stat.trips || 0, distance: Math.round(stat.distance || 0), carbonSaved: parseFloat((stat.carbonSaved || 0).toFixed(1)), ecoCoins: stat.ecoCoins || 0 };
    });

    res.json({ success: true, stats: { totalTrips: user.totalTrips, totalDistance: user.totalDistance, carbonSaved: user.carbonSaved, ecoCoins: user.ecoCoins }, chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/trips/calculate-carbon
export const calculateCarbon = (req, res) => {
  try {
    const { distance, vehicleType } = req.body;
    if (!distance || !vehicleType) {
      return res.status(400).json({ success: false, message: 'Distance and vehicle type are required' });
    }
    const emissionFactor = EMISSION_FACTORS[vehicleType] || 0.02;
    const baselineEmission = BASELINE_EMISSION * distance;
    const ecoEmission = emissionFactor * distance;
    const carbonSaved = parseFloat((baselineEmission - ecoEmission).toFixed(2));

    res.json({
      success: true,
      result: {
        baselineEmission: parseFloat(baselineEmission.toFixed(2)),
        ecoEmission: parseFloat(ecoEmission.toFixed(2)),
        carbonSaved: Math.max(0, carbonSaved),
        equivalentTrees: parseFloat((carbonSaved / 21.77).toFixed(1)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
