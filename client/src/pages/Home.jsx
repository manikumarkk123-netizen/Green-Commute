import { motion } from 'framer-motion';
import { FaLeaf, FaMapMarkerAlt, FaFlagCheckered, FaBolt, FaTaxi, FaBicycle, FaCoins, FaArrowRight, FaCarSide, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleQuickBook = (e) => {
    e.preventDefault();
    navigate('/cab');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#09090b]">
        {/* Abstract Background Gradients */}
        <div className="absolute inset-0 bg-grid-zinc-900/[0.04] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-semibold tracking-wide mb-6 shadow-sm">
                <FaLeaf className="inline text-blue-500 mr-2" />
                Elegant & Sustainable Commute
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                 Elegant Examples <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    of Aesthetic Travel
                 </span>
              </h1>
              <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join a premium network of eco-friendly rides. Experience sustainable travel without compromising on luxury, speed, or design.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/cab" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                  Book a Ride <FaArrowRight />
                </Link>
                <Link to="/rentals" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20">
                  <FaCarSide className="text-blue-500" /> Rent Vehicle
                </Link>
              </div>
              
              <div className="mt-12 flex items-center justify-center gap-6 text-zinc-500 font-medium text-sm">
                 <div className="flex items-center gap-2"><FaCheckCircle className="text-blue-500"/> Zero Emissions</div>
                 <div className="flex items-center gap-2"><FaCheckCircle className="text-blue-500"/> Premium Fleet</div>
                 <div className="flex items-center gap-2"><FaCheckCircle className="text-blue-500"/> Instant Booking</div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#09090b] relative z-10 border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Choose Green Commute?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Experience the future of sustainable transportation with our minimal, ultra-modern premium services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="card bg-zinc-900 border-zinc-800 hover:border-zinc-700 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaTaxi className="text-2xl text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Electric Cabs</h3>
              <p className="text-zinc-400">Book comfortable, ultra-quiet, and sustainable cab rides powered by a high-end electric fleet.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="card bg-zinc-900 border-zinc-800 hover:border-zinc-700 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaBicycle className="text-2xl text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sleek Vehicle Rentals</h3>
              <p className="text-zinc-400">Rent premium electric bikes, scooters, and cars for your daily commute at competitive prices.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="card bg-zinc-900 border-zinc-800 hover:border-zinc-700 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaCoins className="text-2xl text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Earn Premium Coins</h3>
              <p className="text-zinc-400">Get rewarded for every zero-emission ride. Redeem EcoCoins for exclusive high-end brand discounts.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-[#0b0c10] border-t border-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Three simple steps to a better travel experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connection Line (Hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-zinc-800 z-0 pl-24 pr-24" style={{ width: '66%', left: '17%' }}></div>
            
            {[
              { num: 1, title: 'Choose Your Ride', desc: 'Select from cabs, bikes, scooters, or electric cars based on your needs.' },
              { num: 2, title: 'Book & Go', desc: 'Enter your pickup and drop location, confirm your ride, and you\'re on your way.' },
              { num: 3, title: 'Earn EcoCoins', desc: 'Every ride earns you EcoCoins. Redeem them for discounts or plant a tree!' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 border-4 border-zinc-900 ring-2 ring-zinc-800">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6TTYgMzR2LTRIMHY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiLz48L2c+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">10K+</h2>
              <p className="text-blue-100 font-medium tracking-widest uppercase text-xs md:text-sm">Happy Riders</p>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">50K+</h2>
              <p className="text-blue-100 font-medium tracking-widest uppercase text-xs md:text-sm">Rides Completed</p>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">120</h2>
              <p className="text-blue-100 font-medium tracking-widest uppercase text-xs md:text-sm">Cities Covered</p>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">200T</h2>
              <p className="text-blue-100 font-medium tracking-widest uppercase text-xs md:text-sm">CO₂ Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Keyframes for simple CSS animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
