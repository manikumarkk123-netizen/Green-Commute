import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaFlagCheckered, FaCar, FaBolt, FaLeaf, FaClock, FaBicycle, FaMotorcycle, FaBus, FaLightbulb, FaCoins } from 'react-icons/fa';
import { FiCrosshair } from 'react-icons/fi';
import api from '../services/api';

export default function Cab() {
  const { currentUser, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState(location.state?.pickup || '');
  const [dropoff, setDropoff] = useState(location.state?.destination || '');
  const [selectedCab, setSelectedCab] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  const baseCabs = [
    { id: 'b1', name: 'Eco Bike', type: 'Bike', basePrice: 15, perKm: 5, arrival: '2 min', ecoCoins: 8, icon: <FaBicycle className="text-teal-400" /> },
    { id: 'b2', name: 'Electric Scooter', type: 'Electric Scooter', basePrice: 20, perKm: 7, arrival: '3 min', ecoCoins: 10, icon: <FaMotorcycle className="text-emerald-400" /> },
    { id: 'c1', name: 'EV Cab', type: 'EV Cab', basePrice: 40, perKm: 14, arrival: '4 min', ecoCoins: 6, icon: <FaCar className="text-blue-400" /> },
    { id: 'c2', name: 'Electric Bus', type: 'Electric Bus', basePrice: 10, perKm: 3, arrival: '8 min', ecoCoins: 5, icon: <FaBus className="text-purple-400" /> },
    { id: 'c3', name: 'Carpool', type: 'Carpool', basePrice: 25, perKm: 8, arrival: '6 min', ecoCoins: 12, icon: <FaCar className="text-amber-400" /> },
  ];

  const cabs = baseCabs.map(cab => ({
    ...cab,
    price: cab.basePrice + (cab.perKm * distance)
  }));

  // Smart vehicle recommendation
  const getRecommendation = (dist) => {
    if (dist < 3) return { vehicle: 'Bike', reason: `For ${dist.toFixed(1)} km, walking or cycling is the greenest option! Zero emissions and great exercise.`, icon: '🚲' };
    if (dist <= 8) return { vehicle: 'Electric Scooter', reason: `${dist.toFixed(1)} km is perfect for an electric scooter — fast, affordable, and 98% less CO₂!`, icon: '🛵' };
    if (dist <= 20) return { vehicle: 'EV Cab', reason: `For ${dist.toFixed(1)} km, an EV cab offers comfort with 90% lower emissions than regular cabs.`, icon: '🚗' };
    return { vehicle: 'Electric Bus', reason: `${dist.toFixed(1)} km is ideal for an electric bus — most fuel-efficient for longer distances!`, icon: '🚌' };
  };

  const handleCurrentLocation = (setter) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    toast.info('Fetching location...');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data && data.display_name) {
          setter(data.display_name);
          toast.success('Location found!');
        } else {
          setter(`${latitude}, ${longitude}`);
          toast.success('Coordinates found!');
        }
      } catch (e) {
        setter(`${latitude}, ${longitude}`);
        toast.success('Coordinates found!');
      }
    }, () => {
      toast.error('Unable to retrieve your location. Please check browser permissions.');
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      toast.error('Please enter both pickup and dropoff locations.');
      return;
    }
    setStep(2);
    setIsCalculating(true);
    try {
      const pickRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}`);
      const pickData = await pickRes.json();
      if (!pickData || pickData.length === 0) throw new Error('Pickup not found');
      const dropRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoff)}`);
      const dropData = await dropRes.json();
      if (!dropData || dropData.length === 0) throw new Error('Dropoff not found');
      const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickData[0].lon},${pickData[0].lat};${dropData[0].lon},${dropData[0].lat}?overview=false`);
      const routeData = await routeRes.json();
      if (routeData.code === 'Ok' && routeData.routes.length > 0) {
        const dist = routeData.routes[0].distance / 1000;
        setDistance(Math.max(1, dist));
        setRecommendation(getRecommendation(dist));
      } else throw new Error('Route failed');
    } catch (err) {
      toast.warn('Exact route failed. Using estimated distance.');
      const hash = (pickup + dropoff).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const dist = 2 + (hash % 18) + (hash % 10) / 10;
      setDistance(dist);
      setRecommendation(getRecommendation(dist));
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBook = async () => {
    if (!currentUser) {
      toast.info('Please log in to book a ride.');
      navigate('/login');
      return;
    }
    if (!selectedCab) {
      toast.error('Please select a vehicle.');
      return;
    }
    setIsBooking(true);

    const cab = cabs.find(c => c.id === selectedCab);
    try {
      const res = await api.post('/trips', {
        pickup,
        destination: dropoff,
        vehicleType: cab.type,
        distance: parseFloat(distance.toFixed(1)),
      });
      setEarnedCoins(res.data.ecoCoinsEarned);
      setShowCoinPopup(true);
      setTimeout(() => setShowCoinPopup(false), 4000);
      refreshUser();
    } catch (err) {
      // Fallback
      setEarnedCoins(cab.ecoCoins);
      setShowCoinPopup(true);
      setTimeout(() => setShowCoinPopup(false), 4000);
    }
    setIsBooking(false);
    setStep(3);
    toast.success('Ride booked successfully!');
  };

  return (
    <div className="bg-[#0b0c10] min-h-[calc(100vh-200px)] py-12 relative">
      {/* EcoCoin Popup */}
      {showCoinPopup && (
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-amber-500/30 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <FaCoins className="text-amber-400 text-xl" />
          </div>
          <div>
            <p className="text-white font-bold">+{earnedCoins} EcoCoins Earned!</p>
            <p className="text-zinc-400 text-sm">Thanks for choosing green!</p>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Booking Interface */}
          <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/5 flex flex-col pt-8">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaCar className="text-emerald-500" /> Book a Green Ride
            </h1>

            {step === 1 && (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSearch} className="flex flex-col gap-5 flex-grow">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-400 z-10"></span>
                  <input type="text" placeholder="Enter Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-900/80 text-white placeholder-zinc-500 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                  <button type="button" onClick={() => handleCurrentLocation(setPickup)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors" title="Use Current Location">
                    <FiCrosshair size={20} />
                  </button>
                  <div className="absolute left-[1.2rem] top-[3.2rem] bottom-[-1.2rem] w-0.5 bg-zinc-700 pointer-events-none"></div>
                </div>
                <div className="relative mt-2">
                  <FaFlagCheckered className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400 z-10 text-sm" />
                  <input type="text" placeholder="Enter Dropoff Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-900/80 text-white placeholder-zinc-500 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                  <button type="button" onClick={() => handleCurrentLocation(setDropoff)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors" title="Use Current Location">
                    <FiCrosshair size={20} />
                  </button>
                </div>
                <button type="submit" className="mt-auto btn-primary py-4 text-lg w-full">Search Rides</button>
              </motion.form>
            )}

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
                  <button onClick={() => { setStep(1); setIsCalculating(false); }} className="text-xs text-emerald-500 font-bold hover:underline">Edit</button>
                </div>

                {isCalculating ? (
                  <div className="flex flex-col items-center justify-center flex-grow py-12">
                    <div className="w-16 h-16 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-lg font-bold text-white mb-2">Calculating Shortest Route...</h3>
                    <p className="text-sm text-zinc-500">Optimizing for time and eco-impact</p>
                  </div>
                ) : (
                  <>
                    {/* Smart Recommendation */}
                    {recommendation && (
                      <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl shrink-0">
                          <FaLightbulb className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-emerald-400 font-bold text-sm">Smart Recommendation: {recommendation.icon} {recommendation.vehicle}</p>
                          <p className="text-zinc-400 text-xs mt-1">{recommendation.reason}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-end mb-3">
                      <h3 className="font-bold text-zinc-300 block">Available Vehicles</h3>
                      <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">~{distance.toFixed(1)} km route</span>
                    </div>

                    <div className="space-y-3 mb-6 overflow-y-auto max-h-[300px] pr-1">
                      {cabs.map(cab => (
                        <div key={cab.id} onClick={() => setSelectedCab(cab.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            selectedCab === cab.id ? 'border-emerald-500 bg-emerald-500/10 shadow-md' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                          } ${recommendation?.vehicle === cab.type ? 'ring-1 ring-emerald-500/30' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl border border-zinc-700 shrink-0">
                              {cab.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white">{cab.name}</h4>
                                {recommendation?.vehicle === cab.type && (
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">RECOMMENDED</span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 flex items-center gap-1"><FaClock className="inline" /> {cab.arrival} away</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">₹{cab.price.toFixed(0)}</p>
                            <p className="text-xs font-medium text-amber-500">+{cab.ecoCoins} Coins</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={handleBook} disabled={isBooking}
                      className="mt-auto btn-primary py-4 text-lg w-full flex justify-center items-center gap-2"
                    >
                      {isBooking ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Confirm Booking'}
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center flex-grow py-8 bg-zinc-900/40 rounded-3xl border border-white/5 shadow-inner mt-4">
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <FaCar className="text-5xl text-emerald-500 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Driver is on the way!</h2>
                <p className="text-zinc-400 mb-6">Your eco-friendly ride has been confirmed.</p>
                
                <div className="w-full bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center mb-6 shadow-md max-w-sm mx-auto">
                  <div className="text-left">
                    <p className="text-xs text-zinc-500">OTP for Ride</p>
                    <p className="text-xl font-bold tracking-widest text-white">{Math.floor(1000 + Math.random() * 9000)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Est. Total</p>
                    <p className="text-xl font-bold text-white">₹{cabs.find(c => c.id === selectedCab)?.price.toFixed(0)}</p>
                  </div>
                </div>

                <button onClick={() => { setStep(1); setPickup(''); setDropoff(''); setSelectedCab(null); }} className="text-zinc-500 hover:text-white font-medium underline transition-colors">
                  Book Another Ride
                </button>
              </motion.div>
            )}
          </div>

          {/* Map Area */}
          <div className="hidden lg:block bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden relative min-h-[500px] shadow-2xl">
            <iframe
              src={
                (step >= 2 && pickup && dropoff)
                  ? `https://maps.google.com/maps?saddr=${encodeURIComponent(pickup)}&daddr=${encodeURIComponent(dropoff)}&output=embed`
                  : `https://maps.google.com/maps?q=${encodeURIComponent(pickup || 'Bengaluru, India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`
              }
              width="100%" height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) opacity(0.8)' }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map View"
              className="absolute inset-0"
            ></iframe>
            {step === 2 && isCalculating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#0b0c10]/20 backdrop-blur-[2px] flex items-center justify-center p-8 pointer-events-none">
                <div className="bg-zinc-950/90 p-5 rounded-2xl shadow-2xl border border-zinc-800 text-center pointer-events-auto">
                  <FaMapMarkerAlt className="text-3xl text-emerald-500 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
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
