import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaCar, FaLeaf, FaCoins, FaFilter, FaRoute, FaCalendar } from 'react-icons/fa';
import api from '../services/api';

export default function TripHistory() {
  const { currentUser } = useAuth();
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  if (!currentUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const params = filter !== 'all' ? `?filter=${filter}` : '';
        const res = await api.get(`/trips${params}`);
        setTrips(res.data.trips);
      } catch (err) {
        // Fallback mock data
        setTrips([
          { _id: '1', vehicleType: 'EV Cab', pickup: 'MG Road', destination: 'Koramangala', distance: 8.2, price: 135, carbonSaved: 1.64, ecoCoinsEarned: 10, createdAt: new Date().toISOString() },
          { _id: '2', vehicleType: 'Electric Scooter', pickup: 'Indiranagar', destination: 'Whitefield', distance: 12.5, price: 107, carbonSaved: 2.56, ecoCoinsEarned: 25, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', vehicleType: 'Bike', pickup: 'HSR Layout', destination: 'Electronic City', distance: 5.1, price: 45, carbonSaved: 1.03, ecoCoinsEarned: 8, createdAt: new Date(Date.now() - 172800000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [filter]);

  const filters = [
    { value: 'all', label: 'All Trips' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const vehicleIcons = {
    'EV Cab': '🚗',
    'Electric Scooter': '🛵',
    'Bike': '🚲',
    'Electric Bus': '🚌',
    'Carpool': '🚐',
    'Walk/Cycle': '🚶',
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FaRoute className="text-emerald-500" /> Trip History
            </h1>
            <p className="text-zinc-400 mt-1">View and filter all your green rides</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === f.value 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-400">Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="p-16 text-center">
              <FaCar className="text-4xl text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Trips Yet</h3>
              <p className="text-zinc-400">Book your first green ride to see it here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/50">
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Vehicle</th>
                    <th className="p-4 font-bold">Route</th>
                    <th className="p-4 font-bold">Distance</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">CO₂ Saved</th>
                    <th className="p-4 font-bold text-right">EcoCoins</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip._id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 text-zinc-400 text-sm">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-zinc-600" />
                          {new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{vehicleIcons[trip.vehicleType] || '🚗'}</span>
                          <span className="text-white font-medium text-sm">{trip.vehicleType}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white text-sm font-medium">{trip.pickup}</p>
                        <p className="text-zinc-500 text-xs">→ {trip.destination}</p>
                      </td>
                      <td className="p-4 text-zinc-300 font-medium">{trip.distance.toFixed(1)} km</td>
                      <td className="p-4 text-white font-bold">₹{trip.price}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-sm">
                          <FaLeaf className="text-xs" /> {trip.carbonSaved.toFixed(2)} kg
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <FaCoins className="text-xs" /> +{trip.ecoCoinsEarned}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
