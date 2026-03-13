import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLeaf } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#0b0c10] py-12 px-4 min-h-[calc(100vh-140px)]">
      <div className="card w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl border border-white/5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-600/10 border border-emerald-500/20 mb-4">
            <FaLeaf className="text-3xl text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
          <p className="text-zinc-500 mt-2">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="text-3xl text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Email Sent!</h3>
            <p className="text-zinc-400 mb-6">Check your inbox for the password reset link.</p>
            <Link to="/login" className="text-emerald-500 font-bold hover:text-emerald-400">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all font-bold flex justify-center items-center"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-zinc-500 hover:text-emerald-400 font-medium text-sm transition-colors">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
