import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('gc_user');
    const token = localStorage.getItem('gc_token');
    if (storedUser && token) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sign up
  const signup = async (name, email, password, confirmPassword) => {
    const res = await api.post('/users/register', { name, email, password, confirmPassword });
    const { token, user } = res.data;
    localStorage.setItem('gc_token', token);
    localStorage.setItem('gc_user', JSON.stringify(user));
    setCurrentUser(user);
    return res.data;
  };

  // Login
  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('gc_token', token);
    localStorage.setItem('gc_user', JSON.stringify(user));
    setCurrentUser(user);
    return res.data;
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem('gc_token');
    localStorage.removeItem('gc_user');
    setCurrentUser(null);
  };

  // Forgot password
  const forgotPassword = async (email) => {
    const res = await api.post('/users/forgot-password', { email });
    return res.data;
  };

  // Reset password
  const resetPasswordFn = async (token, password) => {
    const res = await api.post(`/users/reset-password/${token}`, { password });
    return res.data;
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const res = await api.get('/users/profile');
      const user = res.data.profile;
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        ecoCoins: user.ecoCoins,
        totalTrips: user.totalTrips,
        totalDistance: user.totalDistance,
        carbonSaved: user.carbonSaved,
        role: user.role,
      };
      localStorage.setItem('gc_user', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword: resetPasswordFn,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
