import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 shadow-sm transition-all py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-md shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all transform group-hover:rotate-12">
            <FaLeaf className="text-white text-xl" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Green<span className="text-zinc-500 font-light">Commute</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-medium text-zinc-300">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/cab" className="hover:text-blue-400 transition-colors">Cab</Link>
          <Link to="/rentals" className="hover:text-blue-400 transition-colors">Rentals</Link>
          <Link to="/rewards" className="hover:text-blue-400 transition-colors">Rewards</Link>
        </div>

        {/* Auth / User */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="group relative flex items-center gap-2 cursor-pointer">
              <FaUserCircle className="text-3xl text-zinc-400 group-hover:text-blue-400 transition-colors" />
              <span className="hidden sm:inline-block font-medium text-zinc-300">{currentUser.email?.split('@')[0]}</span>
              
              {/* Dropdown menu dummy for now */}
              <div className="absolute top-10 right-0 w-48 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                 <Link to="/dashboard" className="px-4 py-2 hover:bg-zinc-800 text-zinc-200 rounded-md">Dashboard</Link>
                 <button onClick={handleLogout} className="px-4 py-2 hover:bg-zinc-800 text-left text-red-400 rounded-md flex items-center gap-2">
                    <FaSignOutAlt /> Logout
                 </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-block font-medium text-zinc-300 hover:text-blue-400 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
