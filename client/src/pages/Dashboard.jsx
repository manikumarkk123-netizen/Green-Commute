import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaUserEdit, FaCoins, FaCar, FaHistory, FaLeaf, FaMedal } from 'react-icons/fa';

export default function Dashboard() {
  const { currentUser } = useAuth();
  
  if (!currentUser) return <Navigate to="/login" replace />;

  const [activeTab, setActiveTab] = useState('overview');

  // Simulated Dashboard Data
  const stats = {
    ecoScore: 850,
    ridesTaken: 12,
    carbonSaved: "45 kg",
    walletBalance: 1200
  };

  const history = [
    { id: 1, type: 'Cab (Electric)', date: 'Oct 12, 2026', cost: '₹250', status: 'Completed', coins: '+50' },
    { id: 2, type: 'Bike Rental', date: 'Oct 10, 2026', cost: '₹80', status: 'Completed', coins: '+25' },
    { id: 3, type: 'Cab (Hybrid)', date: 'Oct 05, 2026', cost: '₹320', status: 'Completed', coins: '+40' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header Profile Section */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 mb-8 overflow-hidden transform transition-all hover:border-white/10">
        {/* Cover Image */}
        <div className="h-48 w-full relative">
          <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Cover" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent"></div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 relative -mt-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}&backgroundColor=3b82f6`} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-[#09090b] shadow-2xl relative z-10 bg-zinc-800" />
          </div>
        
        <div className="flex-grow text-center md:text-left relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{currentUser.displayName || currentUser.email.split('@')[0]}</h1>
          <p className="text-zinc-400 mb-4">{currentUser.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(59,130,246,0.2)]">
               <FaMedal className="text-blue-500" /> Eco Starter
             </span>
             <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
               <FaUserEdit /> Edit Profile
             </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto mt-6 md:mt-0 relative z-10">
          <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 text-white shadow-xl min-w-[200px] flex flex-col items-center md:items-end group hover:border-blue-500/50 transition-colors">
            <p className="text-zinc-400 font-bold text-xs mb-1 uppercase tracking-widest flex items-center gap-2">
               Balance <FaCoins className="text-amber-400 group-hover:animate-pulse" />
            </p>
            <p className="text-3xl font-black text-white">{stats.walletBalance}</p>
          </div>
        </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 p-6 rounded-3xl flex items-center gap-5 hover:bg-zinc-900/80 transition-colors group">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-2xl group-hover:scale-110 transition-transform">
             <FaLeaf />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Eco Score</p>
            <h3 className="text-3xl font-black text-white">{stats.ecoScore}</h3>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 p-6 rounded-3xl flex items-center gap-5 hover:bg-zinc-900/80 transition-colors group">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl group-hover:scale-110 transition-transform">
             <FaCar />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Total Rides</p>
            <h3 className="text-3xl font-black text-white">{stats.ridesTaken}</h3>
          </div>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 p-6 rounded-3xl flex items-center gap-5 hover:bg-zinc-900/80 transition-colors group">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-2xl group-hover:scale-110 transition-transform">
             <FaHistory />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Carbon Saved</p>
            <h3 className="text-3xl font-black text-white">{stats.carbonSaved}</h3>
          </div>
        </div>
      </div>

      {/* Tabs / History View */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="flex border-b border-zinc-800 p-2 gap-2 bg-zinc-950/50">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 font-bold text-sm rounded-xl transition-all ${activeTab === 'overview' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}>Recent Rides</button>
          <button onClick={() => setActiveTab('wallet')} className={`px-6 py-3 font-bold text-sm rounded-xl transition-all ${activeTab === 'wallet' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}>Wallet History</button>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                    <th className="pb-4 font-bold">Type</th>
                    <th className="pb-4 font-bold">Date</th>
                    <th className="pb-4 font-bold">Cost</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold text-right">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-5 font-bold text-white flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-blue-500">
                            {item.type.includes('Cab') ? <FaCar /> : <FaLeaf />}
                         </div>
                         {item.type}
                      </td>
                      <td className="py-5 text-zinc-400 text-sm font-medium">{item.date}</td>
                      <td className="py-5 font-bold text-white">{item.cost}</td>
                      <td className="py-5">
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold tracking-wide">
                              {item.status}
                          </span>
                      </td>
                      <td className="py-5 text-right font-black text-amber-400 group-hover:text-amber-300 transition-colors">{item.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 text-center">
                <button className="text-blue-500 text-sm font-bold hover:text-white hover:underline transition-colors">View All History</button>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
             <div className="py-16 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-zinc-800/50 rounded-full border border-zinc-700/50 flex items-center justify-center text-zinc-600 mb-6 text-4xl shadow-inner">
                 <FaCoins />
               </div>
               <h3 className="text-xl font-bold text-white mb-2 tracking-wide">No Redemptions Yet</h3>
               <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed">You haven't redeemed any EcoCoins yet. Start booking green rides to fill your wallet!</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
