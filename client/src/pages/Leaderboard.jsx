import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaCoins, FaLeaf, FaCar, FaMedal, FaCrown } from 'react-icons/fa';
import api from '../services/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        // Fallback mock data
        setLeaderboard([
          { rank: 1, name: 'Priya Sharma', ecoCoins: 2450, totalTrips: 45, carbonSaved: 82.5 },
          { rank: 2, name: 'Arjun Patel', ecoCoins: 2100, totalTrips: 38, carbonSaved: 71.2 },
          { rank: 3, name: 'Meera Krishnan', ecoCoins: 1800, totalTrips: 32, carbonSaved: 58.9 },
          { rank: 4, name: 'Rahul Dev', ecoCoins: 1550, totalTrips: 28, carbonSaved: 45.3 },
          { rank: 5, name: 'Anita Roy', ecoCoins: 1200, totalTrips: 22, carbonSaved: 38.1 },
          { rank: 6, name: 'Karthik S', ecoCoins: 950, totalTrips: 18, carbonSaved: 30.4 },
          { rank: 7, name: 'Deepa Nair', ecoCoins: 800, totalTrips: 15, carbonSaved: 25.2 },
          { rank: 8, name: 'Vikram Singh', ecoCoins: 650, totalTrips: 12, carbonSaved: 19.8 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const rankStyles = {
    1: { bg: 'from-amber-600/20 to-yellow-600/20', border: 'border-amber-500/30', icon: <FaCrown className="text-amber-400 text-2xl" />, badge: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
    2: { bg: 'from-zinc-400/10 to-zinc-300/10', border: 'border-zinc-400/30', icon: <FaMedal className="text-zinc-300 text-xl" />, badge: 'bg-gradient-to-r from-zinc-400 to-zinc-300' },
    3: { bg: 'from-amber-800/10 to-orange-800/10', border: 'border-amber-700/30', icon: <FaMedal className="text-amber-600 text-xl" />, badge: 'bg-gradient-to-r from-amber-700 to-orange-600' },
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold mb-4">
            <FaTrophy /> Leaderboard
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Eco Champions</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Top eco-friendly riders ranked by EcoCoins earned.</p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            {[1, 0, 2].map((idx) => {
              const user = leaderboard[idx];
              const isFirst = idx === 0;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }}
                  className={`card bg-gradient-to-b ${rankStyles[user.rank]?.bg || ''} ${rankStyles[user.rank]?.border || 'border-zinc-800'} text-center ${isFirst ? 'md:-mt-4' : ''}`}
                >
                  <div className="mb-3">{rankStyles[user.rank]?.icon}</div>
                  <div className={`w-14 h-14 rounded-full ${rankStyles[user.rank]?.badge || 'bg-zinc-700'} flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-lg`}>
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="text-white font-bold text-sm truncate">{user.name}</h3>
                  <p className="text-amber-400 font-black text-lg flex items-center justify-center gap-1 mt-1">
                    <FaCoins className="text-xs" /> {user.ecoCoins}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">{user.carbonSaved} kg saved</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-400">Loading leaderboard...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/50">
                  <th className="p-4 font-bold">Rank</th>
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Trips</th>
                  <th className="p-4 font-bold">CO₂ Saved</th>
                  <th className="p-4 font-bold text-right">EcoCoins</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user) => (
                  <tr key={user.rank} className={`border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors ${user.rank <= 3 ? 'bg-zinc-800/10' : ''}`}>
                    <td className="p-4">
                      {user.rank <= 3 ? (
                        <span className={`w-8 h-8 rounded-full ${rankStyles[user.rank]?.badge} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                          {user.rank}
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-bold ml-2">{user.rank}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 flex items-center gap-1"><FaCar className="text-zinc-600" /> {user.totalTrips}</td>
                    <td className="p-4"><span className="text-emerald-400 font-medium flex items-center gap-1"><FaLeaf className="text-xs" /> {user.carbonSaved} kg</span></td>
                    <td className="p-4 text-right"><span className="text-amber-400 font-black flex items-center justify-end gap-1"><FaCoins className="text-xs" /> {user.ecoCoins}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
