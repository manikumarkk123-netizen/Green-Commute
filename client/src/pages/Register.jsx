import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaLeaf } from 'react-icons/fa';
import axios from 'axios'; // We will use this to sync user to our own backend

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Request OTP from backend
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

  // Step 2: Verify OTP and Complete Registration
  const verifyAndRegister = async () => {
    if (otp.length !== 6) {
       return toast.error("Please enter a 6-digit OTP.");
    }
    
    try {
      setOtpLoading(true);
      // Verify OTP with backend
      const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      
      if (data.success) {
          // OTP verified, now create user in Firebase Auth
          const userCredential = await signup(email, password);
          
          // Attempt to Create user profile in Node Backend API
          try {
            await axios.post('http://localhost:5000/api/users/register', {
              uid: userCredential.user.uid,
              name,
              email,
            });
          } catch (backendError) {
            console.warn('Backend sync failed, but Firebase auth succeeded', backendError);
          }

          setShowOtpModal(false);
          toast.success('Account created successfully!');
          navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-vh-100 bg-[#0b0c10] py-12 px-4 min-h-[calc(100vh-140px)]">
      <div className="card w-full max-w-4xl p-0 shadow-2xl flex flex-col md:flex-row-reverse overflow-hidden border border-white/5 bg-zinc-900/80 backdrop-blur-xl">
        
        {/* Image Section */}
        <div className="md:w-1/2 bg-blue-900/20 relative hidden md:block border-l border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Electric Scooter" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">Join the Movement</h2>
            <p className="text-zinc-400">Start reducing your carbon footprint today with our shared premium fleet.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 mb-3 shadow-inner">
              <FaLeaf className="text-xl text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-zinc-500 mt-1">Sign up for Green Commute</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 block">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

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
            <label className="text-sm font-medium text-zinc-400 block">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="password" 
                required
                minLength="6"
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
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-zinc-500">
          <p>Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">Log in</Link></p>
        </div>
        </div>
      </div>

      {/* OTP Modal Overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0b0c10]/90 backdrop-blur-sm" onClick={() => !otpLoading && setShowOtpModal(false)}></div>
          <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black max-w-sm w-full z-10 text-center transform shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-2xl">
               <FaEnvelope />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Verify Your Email</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">We sent a 6-digit code to <span className="text-white font-medium">{email}</span></p>
            
            <input 
               type="text" 
               maxLength="6"
               value={otp}
               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
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
                onClick={verifyAndRegister}
                disabled={otpLoading}
                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {otpLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Verify & Register'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
