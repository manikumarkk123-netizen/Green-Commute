import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaBicycle, FaMotorcycle, FaCarSide, FaBatteryFull, FaTag, FaCheckCircle } from 'react-icons/fa';

export default function Rentals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rentDays, setRentDays] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const categories = ['All', 'E-Bikes', 'E-Scooters', 'E-Cars'];
  
  const vehicles = [
    { id: 1, type: 'E-Bikes', name: 'City Cruiser Bike', range: '40 km', rate: '₹40/hr', img: '🚲', tag: 'Popular', ecoCoins: 10 },
    { id: 2, type: 'E-Scooters', name: 'Bolt X Scooter', range: '25 km', rate: '₹50/hr', img: '🛴', tag: 'Fast', ecoCoins: 15 },
    { id: 3, type: 'E-Cars', name: 'Tata Nexon EV', range: '312 km', rate: '₹200/hr', img: '🚗', ecoCoins: 100 },
    { id: 4, type: 'E-Bikes', name: 'Mountain Pro E-Bike', range: '60 km', rate: '₹80/hr', img: '🚵', ecoCoins: 20 },
    { id: 5, type: 'E-Scooters', name: 'Glider V2', range: '30 km', rate: '₹60/hr', img: '🛴', ecoCoins: 20 },
    { id: 6, type: 'E-Cars', name: 'MG ZS EV', range: '461 km', rate: '₹300/hr', img: '🚙', tag: 'Premium', ecoCoins: 150 },
  ];

  const filteredVehicles = activeCategory === 'All' ? vehicles : vehicles.filter(v => v.type === activeCategory);

  const handleOpenModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setRentDays(1);
  };

  const handleRent = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Successfully booked ${selectedVehicle.name} for ${rentDays} days! Check your email for pickup details.`);
      setSelectedVehicle(null);
    }, 1500);
  };

  return (
    <div className="bg-[#0b0c10] min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header Cover Image */}
        <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 mb-12 relative flex items-center min-h-[300px] border border-white/5">
           <img src="https://images.unsplash.com/photo-1520697775586-db48a21f6dbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent"></div>
           <div className="relative z-10 p-10 md:p-16 text-left w-full max-w-2xl">
             <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">Rent a <span className="text-blue-500">Premium</span> Vehicle</h1>
             <p className="text-zinc-400 text-lg">Explore the city without the carbon footprint. Choose from our fleet of high-end electric bikes, scooters, and cars.</p>
           </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-zinc-900/50 backdrop-blur-md text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
               {cat === 'E-Bikes' && <FaBicycle className="inline mr-2"/>}
               {cat === 'E-Scooters' && <FaMotorcycle className="inline mr-2"/>}
               {cat === 'E-Cars' && <FaCarSide className="inline mr-2"/>}
               {cat}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={vehicle.id} 
              className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-zinc-800 hover:border-zinc-700 hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="text-6xl group-hover:scale-110 transition-transform origin-bottom-left drop-shadow-xl">
                   {vehicle.img}
                 </div>
                 {vehicle.tag && (
                   <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                     <FaTag /> {vehicle.tag}
                   </span>
                 )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{vehicle.name}</h3>
              <p className="text-zinc-500 text-sm mb-4">{vehicle.type}</p>
              
              <div className="flex justify-between items-center mb-6 pt-4 border-t border-zinc-800 pb-2">
                 <div className="flex flex-col">
                   <span className="text-xs text-zinc-500 font-medium">Range</span>
                   <span className="text-sm font-bold text-zinc-300 flex items-center gap-1"><FaBatteryFull className="text-blue-500"/> {vehicle.range}</span>
                 </div>
                 <div className="flex flex-col text-right">
                   <span className="text-xs text-zinc-500 font-medium">Rate start from</span>
                   <span className="text-xl font-black text-blue-500">{vehicle.rate}</span>
                 </div>
              </div>
              
              <div className="flex items-center justify-between mb-6 bg-zinc-950/50 border border-zinc-800/50 px-4 py-3 rounded-xl">
                <span className="text-xs text-zinc-400 font-medium">EcoCoins per hour: </span>
                <span className="text-sm font-bold text-amber-400">+{vehicle.ecoCoins}</span>
              </div>

              <button onClick={() => handleOpenModal(vehicle)} className="w-full bg-transparent border-2 border-zinc-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all text-center">
                Rent Now
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-blue-600 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-blue-900/40 relative overflow-hidden glass mix-blend-normal">
           <div className="absolute -right-10 -bottom-20 opacity-20 text-[250px] transform rotate-12"><FaCarSide /></div>
           <div className="relative z-10 md:w-2/3 mb-6 md:mb-0 text-center md:text-left">
             <h3 className="text-3xl font-extrabold mb-3">Long Term Rentals?</h3>
             <p className="text-blue-100 text-lg">Planning a weekend getaway or need a vehicle for a month? Check out our premium subscriptions with massive Green incentives.</p>
           </div>
           <button className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-xl font-extrabold hover:bg-zinc-50 hover:shadow-xl transition-all whitespace-nowrap transform hover:-translate-y-1">
             View Subscriptions
           </button>
        </div>

        {/* Booking Modal Overlay */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
              onClick={() => setSelectedVehicle(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black/50 max-w-md w-full z-10"
            >
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white leading-tight">{selectedVehicle.name}</h2>
                   <p className="text-blue-500 font-medium text-sm">{selectedVehicle.type}</p>
                 </div>
                 <div className="text-4xl">{selectedVehicle.img}</div>
              </div>
              
              <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-800 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400 text-sm">Hourly Rate</span>
                  <span className="text-white font-bold">{selectedVehicle.rate}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400 text-sm">Eco Range</span>
                  <span className="text-zinc-300 font-medium">{selectedVehicle.range}</span>
                </div>
                
                <div className="border-t border-zinc-800 pt-4">
                  <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wide">Number of Days to Rent</label>
                  <div className="flex items-center gap-4 bg-zinc-900 rounded-xl p-2 border border-zinc-700">
                     <button onClick={() => setRentDays(Math.max(1, rentDays - 1))} className="w-10 h-10 rounded-lg bg-zinc-800 text-white font-bold hover:bg-zinc-700 flex items-center justify-center">-</button>
                     <span className="flex-grow text-center text-xl font-bold text-white">{rentDays}</span>
                     <button onClick={() => setRentDays(rentDays + 1)} className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 px-2">
                 <span className="text-zinc-400 font-bold">Estimated Total</span>
                 <span className="text-3xl font-black text-white">₹{parseInt(selectedVehicle.rate.replace(/\D/g, '')) * 24 * rentDays}</span>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => setSelectedVehicle(null)} className="flex-1 py-4 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-transparent">Cancel</button>
                <button 
                  onClick={handleRent} 
                  disabled={isProcessing}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center"
                >
                  {isProcessing ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Confirm Booking'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
