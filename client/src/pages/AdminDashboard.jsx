import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaUsers, FaCar, FaLeaf, FaChartBar, FaShieldAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import api from '../services/api';

const COLORS = ['#22c55e', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!currentUser) return <Navigate to="/login" replace />;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
        setChartData(res.data.chartData);
        setVehicleData(res.data.vehicleDistribution);
      } catch (err) {
        // Fallback mock data
        setStats({ totalUsers: 156, totalRides: 2340, totalCarbonSaved: 4562.5, mostUsedVehicle: 'EV Cab' });
        setChartData([
          { month: 'Jan', rides: 180, carbonSaved: 340, revenue: 45000 },
          { month: 'Feb', rides: 220, carbonSaved: 420, revenue: 58000 },
          { month: 'Mar', rides: 310, carbonSaved: 580, revenue: 72000 },
        ]);
        setVehicleData([
          { name: 'EV Cab', value: 45 },
          { name: 'Electric Scooter', value: 30 },
          { name: 'Bike', value: 15 },
          { name: 'Electric Bus', value: 10 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { label: 'Total Rides', value: stats?.totalRides || 0, icon: <FaCar />, color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
    { label: 'CO₂ Saved (kg)', value: (stats?.totalCarbonSaved || 0).toFixed(0), icon: <FaLeaf />, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    { label: 'Top Vehicle', value: stats?.mostUsedVehicle || 'N/A', icon: <FaChartBar />, color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FaShieldAlt className="text-emerald-500" /> Admin Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">Platform analytics and overview</p>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, idx) => (
                <div key={idx} className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 p-5 rounded-2xl flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${card.color} border flex items-center justify-center text-xl`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{card.label}</p>
                    <h3 className="text-2xl font-black text-white">{card.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Monthly Rides */}
              <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Monthly Rides & Revenue</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="rides" fill="#6366f1" radius={[6, 6, 0, 0]} name="Rides" />
                    <Bar dataKey="carbonSaved" fill="#22c55e" radius={[6, 6, 0, 0]} name="CO₂ Saved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Vehicle Distribution */}
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Vehicle Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={vehicleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {vehicleData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Carbon Saved Trend */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Carbon Saved Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="adminCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="carbonSaved" stroke="#22c55e" fillOpacity={1} fill="url(#adminCarbon)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
