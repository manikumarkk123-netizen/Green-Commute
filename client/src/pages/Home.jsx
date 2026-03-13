import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaMapMarkerAlt, FaFlagCheckered, FaBolt, FaBicycle, FaCoins, FaArrowRight, FaCarSide, FaCheckCircle, FaBus, FaMotorcycle, FaStar, FaQuoteLeft, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('EV Cab');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/cab', { state: { pickup, destination, vehicleType } });
  };

  const vehicles = [
    { name: 'Electric Scooter', icon: <FaMotorcycle />, eco: '98% Less CO₂', price: 'From ₹25/km', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { name: 'Bike', icon: <FaBicycle />, eco: '95% Less CO₂', price: 'From ₹15/km', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { name: 'EV Cab', icon: <FaCarSide />, eco: '90% Less CO₂', price: 'From ₹14/km', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { name: 'Electric Bus', icon: <FaBus />, eco: '85% Less CO₂', price: 'From ₹3/km', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  const howItWorks = [
    { step: 1, title: 'Search Ride', desc: 'Enter your pickup & destination locations', icon: <FaSearch /> },
    { step: 2, title: 'Choose Vehicle', desc: 'Pick from our eco-friendly fleet', icon: <FaCarSide /> },
    { step: 3, title: 'Book Ride', desc: 'Confirm your green ride instantly', icon: <FaCheckCircle /> },
    { step: 4, title: 'Earn EcoCoins', desc: 'Get rewarded for going green', icon: <FaCoins /> },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Daily Commuter', text: 'Green Commute has completely changed how I travel. The EV rides are smooth, affordable, and I love earning EcoCoins!', rating: 5, avatar: 'PS' },
    { name: 'Arjun Patel', role: 'Software Engineer', text: 'The smart vehicle recommendation is brilliant. It always suggests the perfect eco-friendly option for my commute distance.', rating: 5, avatar: 'AP' },
    { name: 'Meera Krishnan', role: 'College Student', text: 'As a student, the electric scooter rides are super budget-friendly. Plus I feel great about reducing my carbon footprint!', rating: 4, avatar: 'MK' },
  ];

  return (
    <div className="w-full">
      {/* ===== HERO SECTION WITH BOOKING CARD ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0b0c10]">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full mix-blend-screen filter blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full filter blur-[150px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left: Text */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide mb-6">
                <FaLeaf /> Eco-Friendly Rides
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                Your Green
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Ride Awaits
                </span>
              </h1>
              <p className="text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
                Book eco-friendly rides, reduce your carbon footprint, and earn rewards for every green trip you take.
              </p>

              <div className="flex items-center gap-6 text-zinc-400 text-sm">
                <div className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Zero Emissions</div>
                <div className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Instant Booking</div>
                <div className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Earn Rewards</div>
              </div>
            </motion.div>

            {/* Right: Booking Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-emerald-900/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <FaCarSide className="text-emerald-400 text-sm" />
                  </div>
                  Book a Ride
                </h2>

                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Pickup */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-400 z-10"></span>
                    <input
                      type="text"
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/80 text-white placeholder-zinc-500 border border-zinc-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                    />
                    <div className="absolute left-[1.2rem] top-[3.2rem] bottom-[-1.2rem] w-0.5 bg-zinc-700 pointer-events-none"></div>
                  </div>

                  {/* Destination */}
                  <div className="relative">
                    <FaFlagCheckered className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400 z-10 text-sm" />
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/80 text-white placeholder-zinc-500 border border-zinc-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                    />
                  </div>

                  {/* Vehicle Selection */}
                  <div className="relative">
                    <FaBolt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 z-10 text-sm" />
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/80 text-white border border-zinc-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="Electric Scooter">⚡ Electric Scooter</option>
                      <option value="Bike">🚲 Bike</option>
                      <option value="EV Cab">🚗 EV Cab</option>
                      <option value="Electric Bus">🚌 Electric Bus</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Search Rides <FaArrowRight />
                  </button>
                </form>

                <p className="text-center text-zinc-500 text-xs mt-4">
                  Save up to 95% CO₂ compared to regular vehicles
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ECO BENEFITS SECTION ===== */}
      <section className="py-20 bg-[#0a0b0f] border-t border-zinc-800/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
              <FaLeaf /> Why Go Green?
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Eco Benefits</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Every green ride contributes to a cleaner planet. Here's how you make a difference.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: '🌍 Reduce Carbon Emissions', desc: 'Electric vehicles produce up to 95% less CO₂ than traditional cars. Your rides directly reduce air pollution.', stat: '95%', label: 'Less Emissions' },
              { title: '🌿 Save Natural Resources', desc: 'Electric transport uses renewable energy sources, reducing dependence on fossil fuels and preserving ecosystems.', stat: '60%', label: 'Less Energy' },
              { title: '💚 Earn While You Save', desc: 'Get EcoCoins for every green ride. Redeem them for discounts, plant trees, or donate to environmental causes.', stat: '12+', label: 'Coins Per Ride' },
            ].map((benefit, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.15 }}
                className="card group hover:border-emerald-500/20"
              >
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">{benefit.desc}</p>
                <div className="flex items-end gap-2 pt-4 border-t border-zinc-800/50">
                  <span className="text-3xl font-black text-emerald-400">{benefit.stat}</span>
                  <span className="text-zinc-500 text-sm font-medium pb-1">{benefit.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AVAILABLE VEHICLES ===== */}
      <section className="py-20 bg-[#0b0c10] border-t border-zinc-800/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Our Green Fleet</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Choose from our range of eco-friendly vehicles, each designed for zero-emission travel.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {vehicles.map((vehicle, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className={`card ${vehicle.bg} border ${vehicle.border} text-center group cursor-pointer`}
                onClick={() => navigate('/cab')}
              >
                <div className={`text-4xl mb-4 ${vehicle.color} group-hover:scale-110 transition-transform`}>
                  {vehicle.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{vehicle.name}</h3>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${vehicle.bg} ${vehicle.color} border ${vehicle.border} mb-3`}>
                  {vehicle.eco}
                </span>
                <p className="text-zinc-400 text-sm">{vehicle.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-[#0a0b0f] border-t border-zinc-800/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Four simple steps to a greener commute.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-600/30 via-emerald-500/50 to-emerald-600/30 z-0"></div>

            {howItWorks.map((item, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-2xl font-bold flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 border-4 border-[#0a0b0f] ring-2 ring-emerald-900/50">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-widest">Step {item.step}</div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CARBON IMPACT BANNER ===== */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6TTYgMzR2LTRIMHY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiLz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Our Carbon Impact</h2>
            <p className="text-emerald-100 text-lg">Together, we're making the planet greener</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            {[
              { value: '10K+', label: 'Happy Riders' },
              { value: '200T', label: 'CO₂ Saved (kg)' },
              { value: '50K+', label: 'Green Rides' },
              { value: '120+', label: 'Cities Covered' },
            ].map((stat, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }}>
                <h3 className="text-4xl md:text-5xl font-black mb-2 drop-shadow-md">{stat.value}</h3>
                <p className="text-emerald-100 font-medium tracking-widest uppercase text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-[#0b0c10] border-t border-zinc-800/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">What Our Riders Say</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Join thousands of happy eco-commuters.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.15 }}
                className="card group hover:border-emerald-500/20"
              >
                <FaQuoteLeft className="text-emerald-500/20 text-3xl mb-4" />
                <p className="text-zinc-300 mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-zinc-500 text-xs">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array(t.rating).fill(0).map((_, i) => (
                      <FaStar key={i} className="text-amber-400 text-xs" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
