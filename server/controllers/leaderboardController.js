import User from '../models/User.js';
import { getIsConnected } from '../config/db.js';

// @GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({
        success: true,
        leaderboard: [
          { rank: 1, name: 'Priya S.', email: 'priya@example.com', ecoCoins: 2450, totalTrips: 45, carbonSaved: 82.5 },
          { rank: 2, name: 'Arjun P.', email: 'arjun@example.com', ecoCoins: 2100, totalTrips: 38, carbonSaved: 71.2 },
          { rank: 3, name: 'Meera K.', email: 'meera@example.com', ecoCoins: 1800, totalTrips: 32, carbonSaved: 58.9 },
          { rank: 4, name: 'Rahul D.', email: 'rahul@example.com', ecoCoins: 1550, totalTrips: 28, carbonSaved: 45.3 },
          { rank: 5, name: 'Anita R.', email: 'anita@example.com', ecoCoins: 1200, totalTrips: 22, carbonSaved: 38.1 },
        ],
      });
    }

    const users = await User.find({ role: 'user' })
      .select('name email ecoCoins totalTrips carbonSaved')
      .sort({ ecoCoins: -1 })
      .limit(20);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      email: user.email,
      ecoCoins: user.ecoCoins,
      totalTrips: user.totalTrips,
      carbonSaved: parseFloat(user.carbonSaved.toFixed(1)),
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
