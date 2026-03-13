import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { getIsConnected } from '../config/db.js';

// @GET /api/admin/stats (admin only)
export const getAdminStats = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({
        success: true,
        stats: { totalUsers: 156, totalRides: 2340, totalCarbonSaved: 4562.5, mostUsedVehicle: 'EV Cab' },
        chartData: [
          { month: 'Jan', rides: 180, carbonSaved: 340, revenue: 45000 },
          { month: 'Feb', rides: 220, carbonSaved: 420, revenue: 58000 },
          { month: 'Mar', rides: 310, carbonSaved: 580, revenue: 72000 },
        ],
        vehicleDistribution: [
          { name: 'EV Cab', value: 45 },
          { name: 'Electric Scooter', value: 30 },
          { name: 'Bike', value: 15 },
          { name: 'Electric Bus', value: 10 },
        ],
      });
    }

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRides = await Trip.countDocuments();
    const carbonAgg = await User.aggregate([{ $group: { _id: null, totalCarbonSaved: { $sum: '$carbonSaved' } } }]);
    const totalCarbonSaved = carbonAgg[0]?.totalCarbonSaved || 0;
    const vehicleAgg = await Trip.aggregate([{ $group: { _id: '$vehicleType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    const mostUsedVehicle = vehicleAgg[0]?._id || 'N/A';
    const monthlyRides = await Trip.aggregate([
      { $group: { _id: { $month: '$createdAt' }, rides: { $sum: 1 }, carbonSaved: { $sum: '$carbonSaved' }, revenue: { $sum: '$price' } } },
      { $sort: { _id: 1 } },
    ]);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = months.map((month, idx) => {
      const stat = monthlyRides.find(s => s._id === idx + 1) || {};
      return { month, rides: stat.rides || 0, carbonSaved: parseFloat((stat.carbonSaved || 0).toFixed(1)), revenue: stat.revenue || 0 };
    });
    const vehicleDistribution = vehicleAgg.map(v => ({ name: v._id, value: v.count }));

    res.json({ success: true, stats: { totalUsers, totalRides, totalCarbonSaved: parseFloat(totalCarbonSaved.toFixed(1)), mostUsedVehicle }, chartData, vehicleDistribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
