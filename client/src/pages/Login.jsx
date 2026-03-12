import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaLeaf } from 'react-icons/fa';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Request OTP from backend (we ensure they have an account during verification)
      const { data } = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      if (data.success) {
         toast.success('OTP sent to your email!');
         setShowOtpModal(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Complete Login
  const verifyAndLogin = async () => {
    if (otp.length !== 6) {
       return toast.error("Please enter a 6-digit OTP.");
    }
    
    try {
      setOtpLoading(true);
      // Verify OTP with backend
      const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      
      if (data.success) {
          // OTP verified, now authenticate with Firebase
          await login(email, password);
          setShowOtpModal(false);
          toast.success('Successfully logged in!');
          navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Invalid or expired OTP. Or incorrect password.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-vh-100 bg-[#0b0c10] py-12 px-4 min-h-[calc(100vh-140px)]">
      <div className="card w-full max-w-4xl p-0 shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/5 bg-zinc-900/80 backdrop-blur-xl">
        
        {/* Image Section */}
        <div className="md:w-1/2 bg-blue-900/20 relative hidden md:block border-r border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Minimalist Dark Aesthetic" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back!</h2>
            <p className="text-zinc-400">Continue your journey towards a greener tomorrow.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-600/10 border border-blue-500/20 mb-4 shadow-inner">
              <FaLeaf className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">Sign In</h2>
            <p className="text-zinc-500 mt-2">Access your Green Commute account</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 block">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-zinc-400 block">Password</label>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</a>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all font-bold flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-zinc-500">
          <p>Don't have an account? <Link to="/register" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">Sign up for free</Link></p>
        </div>
        </div>
      </div>

      {/* OTP Modal Overlay - Same style as Register */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0b0c10]/90 backdrop-blur-sm" onClick={() => !otpLoading && setShowOtpModal(false)}></div>
          <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black max-w-sm w-full z-10 text-center transform shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-2xl">
               <FaEnvelope />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">2-Step Verification</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">We sent a 6-digit code to <span className="text-white font-medium">{email}</span></p>
            
            <input 
               type="text" 
               maxLength="6"
               value={otp}
               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
               placeholder="000000"
               className="w-full text-center text-3xl tracking-[0.5em] py-4 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold mb-8"
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowOtpModal(false)} 
                disabled={otpLoading}
                className="flex-1 py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-transparent disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={verifyAndLogin}
                disabled={otpLoading}
                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {otpLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Verify & Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
