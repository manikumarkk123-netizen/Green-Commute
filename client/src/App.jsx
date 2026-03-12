import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cab from './pages/Cab';
import Rentals from './pages/Rentals';
import Rewards from './pages/Rewards';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cab" element={<Cab />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </main>

        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App;
