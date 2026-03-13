import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaLeaf, FaUserCircle, FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cab', label: 'Book Ride' },
    { path: '/rentals', label: 'Rentals' },
    { path: '/route-planner', label: 'Route Planner' },
    { path: '/carbon-calculator', label: 'Carbon Calc' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 shadow-sm transition-all py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-md shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all transform group-hover:rotate-12">
            <FaLeaf className="text-white text-xl" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Green<span className="text-emerald-500">Commute</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 font-medium">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(link.path)
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode}
            className="w-9 h-9 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon />}
          </button>

          {currentUser ? (
            <div className="group relative flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline-block font-medium text-zinc-300 text-sm">{currentUser.name || currentUser.email?.split('@')[0]}</span>
              
              {/* Dropdown */}
              <div className="absolute top-10 right-0 w-52 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                <Link to="/dashboard" className="px-4 py-2.5 hover:bg-zinc-800 text-zinc-200 rounded-lg text-sm font-medium">Dashboard</Link>
                <Link to="/profile" className="px-4 py-2.5 hover:bg-zinc-800 text-zinc-200 rounded-lg text-sm font-medium">Profile</Link>
                <Link to="/trip-history" className="px-4 py-2.5 hover:bg-zinc-800 text-zinc-200 rounded-lg text-sm font-medium">Trip History</Link>
                <Link to="/rewards" className="px-4 py-2.5 hover:bg-zinc-800 text-zinc-200 rounded-lg text-sm font-medium">EcoCoins</Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2.5 hover:bg-zinc-800 text-emerald-400 rounded-lg text-sm font-medium">Admin Panel</Link>
                )}
                <hr className="border-zinc-800 my-1" />
                <button onClick={handleLogout} className="px-4 py-2.5 hover:bg-zinc-800 text-left text-red-400 rounded-lg text-sm font-medium flex items-center gap-2">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-block font-medium text-zinc-300 hover:text-emerald-400 transition-colors text-sm">Login</Link>
              <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all">Sign Up</Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white">
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
