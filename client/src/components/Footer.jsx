import { FaLeaf, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <FaLeaf className="text-primary" />
              GreenCommute
            </Link>
            <p className="mb-4 text-sm">
              Making every commute greener, one ride at a time. Join us in building a sustainable future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaLinkedinIn size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaGithub size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cab" className="hover:text-primary transition-colors">Cab Rides</Link></li>
              <li><Link to="/rentals" className="hover:text-primary transition-colors">Vehicle Rentals</Link></li>
              <li><Link to="/rewards" className="hover:text-primary transition-colors">EcoCoins</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm mb-4">Get the latest news on sustainable commuting.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-3 py-2 bg-slate-800 border-none rounded-l-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className="bg-primary hover:bg-emerald-600 px-4 py-2 rounded-r-md text-white font-medium text-sm transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm">
          <p>&copy; 2026 GreenCommute. All rights reserved. Made with 💚 for the planet.</p>
        </div>
      </div>
    </footer>
  );
}
