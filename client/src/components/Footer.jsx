import { FaLeaf, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50 text-zinc-400 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <FaLeaf className="text-emerald-500" />
              Green<span className="text-emerald-500">Commute</span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed">
              Making every commute greener, one ride at a time. Join us in building a sustainable future.
            </p>
            <div className="flex gap-3">
              {[FaTwitter, FaInstagram, FaLinkedinIn, FaGithub].map((Icon, idx) => (
                <a key={idx} href="#" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cab" className="hover:text-emerald-400 transition-colors">Book a Ride</Link></li>
              <li><Link to="/rentals" className="hover:text-emerald-400 transition-colors">Vehicle Rentals</Link></li>
              <li><Link to="/carbon-calculator" className="hover:text-emerald-400 transition-colors">Carbon Calculator</Link></li>
              <li><Link to="/rewards" className="hover:text-emerald-400 transition-colors">EcoCoins & Rewards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/leaderboard" className="hover:text-emerald-400 transition-colors">Eco Leaderboard</Link></li>
              <li><Link to="/trip-history" className="hover:text-emerald-400 transition-colors">Trip History</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-400 transition-colors">My Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Project Info</h4>
            <p className="text-sm mb-4 leading-relaxed">Green Commute is a full-stack eco-friendly ride booking platform built with React, Node.js, and MongoDB.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg">React</span>
              <span className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg">Node.js</span>
              <span className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg">MongoDB</span>
              <span className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg">Tailwind</span>
            </div>
          </div>

        </div>
        
        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-sm">
          <p>&copy; 2026 GreenCommute. All rights reserved. Made with 💚 for the planet.</p>
        </div>
      </div>
    </footer>
  );
}
