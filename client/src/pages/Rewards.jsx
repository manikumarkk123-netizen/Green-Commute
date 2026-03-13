import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaCoins, FaTree, FaBolt, FaTicketAlt, FaCoffee, FaGift } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Rewards() {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(currentUser?.ecoCoins || 1200);

  if (!currentUser) return <Navigate to="/login" replace />;

  const rewards = [
    { id: 1, title: 'Plant a Tree', desc: 'Donate coins to our global reforestation partner.', cost: 500, icon: <FaTree className="text-emerald-500" />, type: 'Charity', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: '20% Off Next Ride', desc: 'Get a heavy discount on your next eco ride.', cost: 300, icon: <FaTicketAlt className="text-amber-500" />, type: 'Discount', img: 'https://images.unsplash.com/photo-1620050854499-4d6cb6007ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Free Coffee Scan', desc: 'Redeem at any partner eco-café location.', cost: 150, icon: <FaCoffee className="text-amber-700" />, type: 'Partner', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Free E-Bike Day', desc: 'Get 24hrs free on any E-Bike rental.', cost: 800, icon: <FaBolt className="text-blue-500" />, type: 'Rental', img: 'https://images.unsplash.com/photo-1520697775586-db48a21f6dbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  ];

  const handleRedeem = (reward) => {
    if (balance >= reward.cost) {
      setBalance(b => b - reward.cost);
      toast.success(`Successfully redeemed: ${reward.title}!`);
    } else {
      toast.error('Insufficient EcoCoins.');
    }
  };

  return (
    <div className="bg-[#0b0c10] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Wallet Header */}
        <div className="bg-zinc-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-emerald-900/10 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-white/5">
          <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent"></div>
          <div className="absolute -left-10 -top-10 text-emerald-500/10 text-[200px]"><FaCoins /></div>
           
          <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-3xl font-extrabold mb-2">EcoCoins Wallet</h1>
            <p className="text-zinc-400 max-w-md">Earn coins by picking zero-emission rides. Use them for discounts, partner perks, or saving the planet.</p>
          </div>

          <div className="relative z-10 bg-zinc-950/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[200px] shadow-xl">
            <p className="text-zinc-500 font-bold mb-1 uppercase tracking-widest text-xs">Available Balance</p>
            <div className="text-5xl font-black text-amber-500 flex items-center justify-center gap-2 drop-shadow-md">
              <FaCoins className="text-3xl" /> {balance}
            </div>
          </div>
        </div>

        {/* Rewards grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Available Rewards</h2>
          <p className="text-zinc-500">Pick how you want to use your green impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward, index) => (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}
              key={reward.id} className="bg-zinc-900/50 backdrop-blur-md p-0 rounded-3xl shadow-lg border border-zinc-800 flex flex-col hover:border-zinc-700 hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="h-40 w-full relative overflow-hidden">
                <img src={reward.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100" alt={reward.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent flex items-end p-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl shadow-xl border border-zinc-700">
                    {reward.icon}
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2 block">{reward.type}</span>
                <h3 className="text-xl font-bold text-white mb-2">{reward.title}</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed flex-grow">{reward.desc}</p>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-zinc-800/50 mt-auto">
                  <span className="font-extrabold text-amber-500 flex items-center gap-2 text-lg">
                    <FaCoins /> {reward.cost} Coins
                  </span>
                  <button onClick={() => handleRedeem(reward)} disabled={balance < reward.cost}
                    className={`px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto shadow-md ${
                      balance >= reward.cost
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Referral Banner */}
        <div className="mt-16 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-xl">
          <FaGift className="absolute -right-8 -bottom-8 text-[150px] text-emerald-500/10" />
          <div className="relative z-10 w-full md:w-2/3">
            <h3 className="text-2xl font-bold text-white mb-2">Invite Friends, Earn Faster</h3>
            <p className="text-emerald-200 mb-6 text-lg">Get 200 EcoCoins for every friend who signs up and completes their first green ride.</p>
            <div className="flex shadow-lg rounded-xl overflow-hidden max-w-md">
              <input type="text" readOnly value="https://greencommute.app/ref/you" className="bg-zinc-900/80 border-y border-l border-zinc-700 px-4 py-3 w-full text-sm text-zinc-400 focus:outline-none font-medium tracking-wide" />
              <button onClick={() => toast.success('Link copied!')} className="bg-emerald-600 text-white px-6 py-3 font-bold text-sm hover:bg-emerald-500 transition-colors">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
