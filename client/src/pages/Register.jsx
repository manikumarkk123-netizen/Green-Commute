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
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Create user in Firebase Auth
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

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
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
    </div>
  );
}
