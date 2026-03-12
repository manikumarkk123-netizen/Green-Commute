import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaFlagCheckered, FaCar, FaBolt, FaLeaf, FaClock } from 'react-icons/fa';

export default function Cab() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedCab, setSelectedCab] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const baseCabs = [
    { id: 'c1', name: 'Economy Electric', type: 'Tata Tigor EV', basePrice: 50, perKm: 12, arrival: '3 min', ecoCoins: 50, img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'c2', name: 'Premium Hybrid', type: 'Toyota Camry', basePrice: 100, perKm: 18, arrival: '5 min', ecoCoins: 30, img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'c3', name: 'Ultra Green', type: 'Tesla Model 3', basePrice: 200, perKm: 25, arrival: '7 min', ecoCoins: 80, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  ];

  const cabs = baseCabs.map(cab => ({
    ...cab,
    price: cab.basePrice + (cab.perKm * distance)
  }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      toast.error('Please enter both pickup and dropoff locations.');
      return;
    }
    // Simulate distance calculation based on input string length
    const mockDistance = Math.max(3, ((pickup.length + dropoff.length) * 1.2) % 35);
    setDistance(mockDistance);
    
    setStep(2);
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 2500); // 2.5 seconds delay for simulation
  };

  const handleBook = () => {
    if (!currentUser) {
      toast.info('Please log in to book a ride.');
      // Actually navigate to login could be added, but for now just toast.
    }
    if (!selectedCab) {
      toast.error('Please select a cab.');
      return;
    }
    
    setIsBooking(true);
    // Simulate booking API call
    setTimeout(() => {
      setIsBooking(false);
      setStep(3);
      toast.success('Ride booked successfully!');
    }, 2000);
  };

  return (
    <div className="bg-[#0b0c10] min-h-[calc(100vh-200px)] py-12">
      <div className="container mx-auto px-4">
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Booking Interface */}
          <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl shadow-blue-900/10 border border-white/5 flex flex-col pt-8">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaCar className="text-blue-500"/> Book a Green Ride
            </h1>

            {/* Step 1: Location Entry */}
            {step === 1 && (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSearch} className="flex flex-col gap-5 flex-grow">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500/20 border-4 border-blue-500 z-10"></span>
                  <input 
                    type="text" 
                    placeholder="Enter Pickup Location" 
                    value={pickup} onChange={(e) => setPickup(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 text-white placeholder-zinc-500 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                  <div className="absolute left-[1.35rem] top-10 bottom-[-1.5rem] w-0.5 bg-zinc-800 pointer-events-none"></div>
                </div>

                <div className="relative mt-2">
                   <FaFlagCheckered className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 z-10" />
                   <input 
                    type="text" 
                    placeholder="Enter Dropoff Location" 
                    value={dropoff} onChange={(e) => setDropoff(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 text-white placeholder-zinc-500 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                <button type="submit" className="mt-auto btn-primary py-4 text-lg w-full">Search Cabs</button>
              </motion.form>
            )}

            {/* Step 2: Cab Selection */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                   <div className="text-sm">
                     <p className="text-zinc-500 text-xs">Pickup</p>
                     <p className="font-semibold text-white truncate max-w-[120px]">{pickup}</p>
                   </div>
                   <div className="text-zinc-600 text-xs">➔</div>
                   <div className="text-sm text-right">
                     <p className="text-zinc-500 text-xs">Dropoff</p>
                     <p className="font-semibold text-white truncate max-w-[120px]">{dropoff}</p>
                   </div>
                   <button onClick={() => {setStep(1); setIsCalculating(false);}} className="text-xs text-blue-500 font-bold hover:underline">Edit</button>
                </div>

                {isCalculating ? (
                  <div className="flex flex-col items-center justify-center flex-grow py-12">
                     <div className="w-16 h-16 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                     <h3 className="text-lg font-bold text-white mb-2">Calculating Shortest Route...</h3>
                     <p className="text-sm text-zinc-500">Optimizing for time and eco-impact</p>
                  </div>
                ) : (
                  <>

                <div className="flex justify-between items-end mb-3">
                  <h3 className="font-bold text-zinc-300 block">Available Vehicles</h3>
                  <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">~{distance.toFixed(1)} km route</span>
                </div>
                
                <div className="space-y-3 mb-6 overflow-y-auto max-h-[300px] pr-1">
                  {cabs.map(cab => (
                    <div 
                      key={cab.id} 
                      onClick={() => setSelectedCab(cab.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCab === cab.id ? 'border-blue-500 bg-blue-500/10 shadow-md' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden border border-zinc-700 shrink-0">
                          <img src={cab.img} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{cab.name}</h4>
                          <p className="text-xs text-zinc-400 flex items-center gap-1"><FaClock className="inline"/> {cab.arrival} away • {cab.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">₹{cab.price.toFixed(2)}</p>
                        <p className="text-xs font-medium text-amber-500">+{cab.ecoCoins} Coins</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleBook} 
                  disabled={isBooking}
                  className="mt-auto btn-primary py-4 text-lg w-full flex justify-center items-center gap-2"
                >
                  {isBooking ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Confirm Booking'}
                </button>
                  </>
                )}
              </motion.div>
            )}

            {/* Step 3: Finding Driver / Confirmed */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center flex-grow py-8 bg-zinc-900/40 rounded-3xl border border-white/5 shadow-inner mt-4">
                 <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <FaCar className="text-5xl text-blue-500 animate-bounce" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Driver is on the way!</h2>
                 <p className="text-zinc-400 mb-6">Captain Rahul (Electric Tata Tigor) is 3 minutes away.</p>
                 
                 <div className="w-full bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center mb-6 shadow-md max-w-sm mx-auto">
                    <div className="text-left">
                       <p className="text-xs text-zinc-500">OTP for Ride</p>
                       <p className="text-xl font-bold tracking-widest text-white">8421</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-zinc-500">Est. Total</p>
                       <p className="text-xl font-bold text-white">₹{cabs.find(c=>c.id === selectedCab)?.price.toFixed(2)}</p>
                    </div>
                 </div>

                 <button onClick={() => {setStep(1); setPickup(''); setDropoff(''); setSelectedCab(null);}} className="text-zinc-500 hover:text-white font-medium underline transition-colors">
                   Cancel Ride
                 </button>
              </motion.div>
            )}

          </div>

          {/* Map Simulation Area */}
          <div className="hidden lg:block bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden relative min-h-[500px] shadow-2xl">
            <iframe 
               src={
                 (step >= 2 && pickup && dropoff)
                   ? `https://maps.google.com/maps?saddr=${encodeURIComponent(pickup)}&daddr=${encodeURIComponent(dropoff)}&output=embed`
                   : `https://maps.google.com/maps?q=${encodeURIComponent(pickup || 'Bengaluru, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`
               }
              width="100%" 
              height="100%" 
              style={{ border:0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) opacity(0.8)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Map View"
              className="absolute inset-0"
            ></iframe>
            {/* Map Overlay Graphic for aesthetics */}
            {step === 2 && isCalculating && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#0b0c10]/20 backdrop-blur-[2px] flex items-center justify-center p-8 pointer-events-none">
                  <div className="bg-zinc-950/90 p-5 rounded-2xl shadow-2xl border border-zinc-800 text-center pointer-events-auto">
                    <FaMapMarkerAlt className="text-3xl text-blue-500 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <p className="font-bold text-white tracking-wide">Calculating Route...</p>
                  </div>
               </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
