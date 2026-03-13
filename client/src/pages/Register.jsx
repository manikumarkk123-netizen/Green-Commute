import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaLeaf, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, text: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { level: 3, text: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { level: 4, text: 'Strong', color: 'bg-emerald-500' };
    return { level: 5, text: 'Very Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      const data = await signup(name, email, password, confirmPassword);
      toast.success(data.message || 'Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create an account.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#0b0c10] py-12 px-4 min-h-[calc(100vh-140px)]">
      <div className="card w-full max-w-4xl p-0 shadow-2xl flex flex-col md:flex-row-reverse overflow-hidden border border-white/5 bg-zinc-900/80 backdrop-blur-xl">
        
        {/* Image Section */}
        <div className="md:w-1/2 bg-emerald-900/20 relative hidden md:block border-l border-white/5">
          <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Electric Vehicle" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">Join the Movement</h2>
            <p className="text-zinc-400">Start reducing your carbon footprint today.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 mb-3 shadow-inner">
              <FaLeaf className="text-xl text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-zinc-500 mt-1">Sign up for Green Commute</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 block">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 block">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 block">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type={showPassword ? 'text' : 'password'} required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Password Strength Bar */}
            {password && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-grow flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-zinc-800'}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium ${strength.level >= 4 ? 'text-emerald-400' : strength.level >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {strength.text}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 block">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {confirmPassword && (
                <FaCheckCircle className={`absolute right-3 top-1/2 -translate-y-1/2 ${password === confirmPassword ? 'text-emerald-500' : 'text-red-500'}`} />
              )}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all font-bold flex justify-center items-center gap-2"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-zinc-500">
          <p>Already have an account? <Link to="/login" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">Log in</Link></p>
        </div>
        </div>
      </div>
    </div>
  );
}
