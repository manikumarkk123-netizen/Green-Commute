import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaTree, FaCarSide, FaBicycle, FaMotorcycle, FaBus, FaCalculator } from 'react-icons/fa';
import api from '../services/api';

export default function CarbonCalculator() {
  const [distance, setDistance] = useState('');
  const [vehicleType, setVehicleType] = useState('EV Cab');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const vehicles = [
    { value: 'Electric Scooter', label: 'Electric Scooter', icon: <FaMotorcycle /> },
    { value: 'Bike', label: 'Bike', icon: <FaBicycle /> },
    { value: 'EV Cab', label: 'EV Cab', icon: <FaCarSide /> },
    { value: 'Electric Bus', label: 'Electric Bus', icon: <FaBus /> },
  ];

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!distance || distance <= 0) return;
    setLoading(true);
    try {
      const res = await api.post('/trips/calculate-carbon', {
        distance: parseFloat(distance),
        vehicleType,
      });
      setResult(res.data.result);
    } catch (err) {
      // Fallback local calculation
      const factors = { 'Electric Scooter': 0.005, 'Bike': 0.008, 'EV Cab': 0.02, 'Electric Bus': 0.03 };
      const baseline = 0.21 * parseFloat(distance);
      const eco = (factors[vehicleType] || 0.02) * parseFloat(distance);
      setResult({
        baselineEmission: parseFloat(baseline.toFixed(2)),
        ecoEmission: parseFloat(eco.toFixed(2)),
        carbonSaved: parseFloat((baseline - eco).toFixed(2)),
        equivalentTrees: parseFloat(((baseline - eco) / 21.77).toFixed(1)),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">
            <FaLeaf /> Carbon Calculator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Calculate Your Carbon Impact</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">See how much CO₂ you can save by choosing eco-friendly vehicles.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <div className="card bg-zinc-900/80">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FaCalculator className="text-emerald-400" /> Trip Details
            </h3>
            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-zinc-400 block mb-2">Trip Distance (km)</label>
                <input
                  type="number" min="0.1" step="0.1" required value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Enter distance in km"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-400 block mb-3">Vehicle Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {vehicles.map(v => (
                    <button key={v.value} type="button" onClick={() => setVehicleType(v.value)}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 text-sm font-bold ${
                        vehicleType === v.value
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {v.icon} {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Calculate Impact'}
              </button>
            </form>
          </div>

          {/* Result Card */}
          <div className="card bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/10">
            {result ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <h3 className="text-lg font-bold text-white mb-6">Your Carbon Impact</h3>

                <div className="space-y-4 mb-6">
                  <div className="bg-zinc-950/50 rounded-xl p-4 flex justify-between items-center border border-zinc-800/50">
                    <span className="text-zinc-400 text-sm">Regular Vehicle Emissions</span>
                    <span className="text-red-400 font-bold">{result.baselineEmission} kg CO₂</span>
                  </div>
                  <div className="bg-zinc-950/50 rounded-xl p-4 flex justify-between items-center border border-zinc-800/50">
                    <span className="text-zinc-400 text-sm">Eco Vehicle Emissions</span>
                    <span className="text-emerald-400 font-bold">{result.ecoEmission} kg CO₂</span>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center mb-6">
                  <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2">Carbon Saved</p>
                  <p className="text-5xl font-black text-emerald-400">{result.carbonSaved}</p>
                  <p className="text-emerald-300 text-sm">kg CO₂</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-zinc-400">
                  <FaTree className="text-emerald-500" />
                  <span>Equivalent to <strong className="text-white">{result.equivalentTrees} trees</strong> absorbing CO₂ for a year</span>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <FaLeaf className="text-3xl text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Calculate</h3>
                <p className="text-zinc-400 max-w-xs">Enter your trip details to see your carbon impact and how much you can save.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
