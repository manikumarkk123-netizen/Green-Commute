import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { FaLeaf, FaCoins, FaCar, FaRoute, FaMedal, FaUserEdit } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const { currentUser, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!currentUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/trips/stats');
        setStats(res.data.stats);
        setChartData(res.data.chartData);
      } catch (err) {
        // Fallback mock data
        setStats({
          totalTrips: currentUser.totalTrips || 0,
          totalDistance: currentUser.totalDistance || 0,
          carbonSaved: currentUser.carbonSaved || 0,
          ecoCoins: currentUser.ecoCoins || 0,
        });
        setChartData([
          { month: 'Jan', trips: 2, carbonSaved: 3.2, ecoCoins: 40 },
          { month: 'Feb', trips: 5, carbonSaved: 8.1, ecoCoins: 95 },
          { month: 'Mar', trips: 3, carbonSaved: 4.5, ecoCoins: 60 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    refreshUser();
  }, []);

  const statCards = [
    { label: 'Total Trips', value: stats?.totalTrips || 0, icon: <FaCar />, color: 'from-blue-600 to-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { label: 'Distance Travelled', value: `${(stats?.totalDistance || 0).toFixed(1)} km`, icon: <FaRoute />, color: 'from-indigo-600 to-indigo-400', iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
    { label: 'Carbon Saved', value: `${(stats?.carbonSaved || 0).toFixed(1)} kg`, icon: <FaLeaf />, color: 'from-emerald-600 to-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    { label: 'EcoCoins', value: stats?.ecoCoins || 0, icon: <FaCoins />, color: 'from-amber-600 to-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Profile Header */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 mb-8 overflow-hidden">
          <div className="h-32 w-full relative bg-gradient-to-r from-emerald-900/40 to-teal-900/40">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] to-transparent"></div>
          </div>
          <div className="px-6 md:px-8 pb-6 flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-[#0b0c10]">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">{currentUser.name || currentUser.email?.split('@')[0]}</h1>
              <p className="text-zinc-400 text-sm">{currentUser.email}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/profile" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-700/50">
                <FaUserEdit /> Edit Profile
              </Link>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold">
                <FaMedal /> Eco {(stats?.totalTrips || 0) > 10 ? 'Champion' : 'Starter'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 p-5 rounded-2xl flex items-center gap-4 hover:bg-zinc-900/80 transition-colors group">
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} border flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{card.label}</p>
                <h3 className="text-2xl font-black text-white">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Carbon Saved Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="carbonSaved" stroke="#10b981" fillOpacity={1} fill="url(#colorCarbon)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Trips per Month</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="trips" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/trip-history" className="card hover:border-emerald-500/20 group flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl group-hover:scale-110 transition-transform">📋</div>
            <div>
              <h4 className="text-white font-bold">Trip History</h4>
              <p className="text-zinc-500 text-sm">View all your past rides</p>
            </div>
          </Link>
          <Link to="/leaderboard" className="card hover:border-amber-500/20 group flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl group-hover:scale-110 transition-transform">🏆</div>
            <div>
              <h4 className="text-white font-bold">Eco Leaderboard</h4>
              <p className="text-zinc-500 text-sm">See top eco-friendly riders</p>
            </div>
          </Link>
          <Link to="/carbon-calculator" className="card hover:border-teal-500/20 group flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xl group-hover:scale-110 transition-transform">🌍</div>
            <div>
              <h4 className="text-white font-bold">Carbon Calculator</h4>
              <p className="text-zinc-500 text-sm">Check your carbon impact</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
