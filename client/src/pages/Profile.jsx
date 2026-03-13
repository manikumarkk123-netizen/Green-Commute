import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCar, FaLeaf, FaCoins, FaRoute, FaMedal } from 'react-icons/fa';

export default function Profile() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  const profileFields = [
    { label: 'Full Name', value: currentUser.name || 'N/A', icon: <FaUser className="text-emerald-400" /> },
    { label: 'Email', value: currentUser.email, icon: <FaEnvelope className="text-blue-400" /> },
    { label: 'Total Trips', value: currentUser.totalTrips || 0, icon: <FaCar className="text-indigo-400" /> },
    { label: 'Total Distance', value: `${(currentUser.totalDistance || 0).toFixed(1)} km`, icon: <FaRoute className="text-purple-400" /> },
    { label: 'Carbon Saved', value: `${(currentUser.carbonSaved || 0).toFixed(1)} kg CO₂`, icon: <FaLeaf className="text-emerald-400" /> },
    { label: 'EcoCoins Balance', value: currentUser.ecoCoins || 0, icon: <FaCoins className="text-amber-400" /> },
  ];

  const getBadge = () => {
    const trips = currentUser.totalTrips || 0;
    if (trips >= 50) return { name: 'Eco Legend', color: 'from-amber-600 to-yellow-500' };
    if (trips >= 20) return { name: 'Eco Champion', color: 'from-emerald-600 to-teal-500' };
    if (trips >= 10) return { name: 'Eco Warrior', color: 'from-blue-600 to-indigo-500' };
    return { name: 'Eco Starter', color: 'from-zinc-600 to-zinc-500' };
  };

  const badge = getBadge();

  return (
    <div className="min-h-screen bg-[#0b0c10] py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Profile Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-emerald-900/60 to-teal-900/60 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
          </div>

          {/* Avatar & Name */}
          <div className="px-8 pb-8 -mt-16 relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-zinc-900 mb-4">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
              </div>
              <h1 className="text-2xl font-bold text-white">{currentUser.name || 'User'}</h1>
              <p className="text-zinc-400 text-sm mb-3">{currentUser.email}</p>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r ${badge.color} text-white rounded-full text-sm font-bold shadow-lg`}>
                <FaMedal /> {badge.name}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileFields.map((field, idx) => (
                <div key={idx} className="bg-zinc-800/30 border border-zinc-800/50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    {field.icon}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{field.label}</p>
                    <p className="text-white font-bold">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
