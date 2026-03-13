import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Cab from './pages/Cab';
import Rentals from './pages/Rentals';
import Rewards from './pages/Rewards';
import TripHistory from './pages/TripHistory';
import Profile from './pages/Profile';
import CarbonCalculator from './pages/CarbonCalculator';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import RoutePlanner from './pages/RoutePlanner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/cab" element={<Cab />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/carbon-calculator" element={<CarbonCalculator />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/trip-history" element={
                <ProtectedRoute><TripHistory /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/rewards" element={
                <ProtectedRoute><Rewards /></ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/route-planner" element={<RoutePlanner />} />
            </Routes>
          </main>

          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
            toastStyle={{
              backgroundColor: '#18181b',
              color: '#f4f4f5',
              border: '1px solid #27272a',
              borderRadius: '12px',
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
