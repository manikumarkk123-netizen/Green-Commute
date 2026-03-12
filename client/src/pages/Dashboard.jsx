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
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 mb-8 overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 w-full relative">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 relative -mt-20">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white shadow-xl relative z-10 bg-emerald-50" />
        
        <div className="flex-grow text-center md:text-left relative z-10">
          <h1 className="text-3xl font-bold text-slate-800">{currentUser.displayName || currentUser.email.split('@')[0]}</h1>
          <p className="text-slate-500 mb-4">{currentUser.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
               <FaMedal className="text-amber-500" /> Eco Starter
             </span>
             <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
               <FaUserEdit /> Edit Profile
             </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto mt-6 md:mt-0 relative z-10">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/20 text-center md:text-left min-w-[200px]">
            <p className="text-emerald-50 font-medium text-sm mb-1 uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
              <FaCoins className="text-amber-300" /> EcoCoins Balance
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-t-4 border-t-primary flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-primary text-xl">
             <FaLeaf />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Eco Score</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.ecoScore}</h3>
          </div>
        </div>
        <div className="card border-t-4 border-t-blue-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
             <FaCar />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Rides</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.ridesTaken}</h3>
          </div>
        </div>
        <div className="card border-t-4 border-t-teal-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl">
             <FaHistory />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Carbon Saved</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.carbonSaved}</h3>
          </div>
        </div>
      </div>

      {/* Tabs / History View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 p-2">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 font-medium text-sm rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-slate-50 text-primary' : 'text-slate-500 hover:text-slate-800'}`}>Recent Rides</button>
          <button onClick={() => setActiveTab('wallet')} className={`px-6 py-3 font-medium text-sm rounded-lg transition-colors ${activeTab === 'wallet' ? 'bg-slate-50 text-primary' : 'text-slate-500 hover:text-slate-800'}`}>Wallet History</button>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-sm border-b border-slate-100">
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Cost</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-medium text-slate-800">{item.type}</td>
                      <td className="py-4 text-slate-500">{item.date}</td>
                      <td className="py-4 font-medium text-slate-800">{item.cost}</td>
                      <td className="py-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">{item.status}</span></td>
                      <td className="py-4 text-right font-bold text-amber-500">{item.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-center">
                <button className="text-primary text-sm font-medium hover:underline">View All History</button>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
             <div className="py-12 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 text-3xl">
                 <FaCoins />
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">No Redemptions Yet</h3>
               <p className="text-slate-500 max-w-sm mb-6">You haven't redeemed any EcoCoins yet. Start booking green rides to fill your wallet!</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
