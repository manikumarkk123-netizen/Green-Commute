import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getIsConnected } from '../config/db.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// In-memory mock store for when MongoDB is not available
const mockUsers = [];

// @POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // --- Mock Mode ---
    if (!getIsConnected()) {
      const existing = mockUsers.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockUser = {
        _id: 'mock_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        role: 'user',
        isVerified: false,
        ecoCoins: 0,
        totalTrips: 0,
        totalDistance: 0,
        carbonSaved: 0,
      };
      mockUsers.push(mockUser);

      const token = generateToken(mockUser);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          isVerified: mockUser.isVerified,
          ecoCoins: mockUser.ecoCoins,
          role: mockUser.role,
        },
        message: 'Account created (mock mode)! MongoDB not connected.',
      });
    }

    // --- Database Mode ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailErr) {
      console.warn('Email sending failed:', emailErr.message);
    }

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        ecoCoins: user.ecoCoins,
        role: user.role,
      },
      message: 'Account created! Please check your email to verify.',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // --- Mock Mode ---
    if (!getIsConnected()) {
      const mockUser = mockUsers.find(u => u.email === email);
      if (!mockUser) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, mockUser.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const token = generateToken(mockUser);
      return res.json({
        success: true,
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          isVerified: mockUser.isVerified,
          ecoCoins: mockUser.ecoCoins,
          totalTrips: mockUser.totalTrips || 0,
          totalDistance: mockUser.totalDistance || 0,
          carbonSaved: mockUser.carbonSaved || 0,
          role: mockUser.role,
        },
      });
    }

    // --- Database Mode ---
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        ecoCoins: user.ecoCoins,
        totalTrips: user.totalTrips,
        totalDistance: user.totalDistance,
        carbonSaved: user.carbonSaved,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/users/verify/:token
export const verifyEmail = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json({ success: true, message: 'Email verified (mock mode)!' });
    }

    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!getIsConnected()) {
      return res.json({ success: true, message: 'If an account exists, a reset email has been sent.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset email has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailErr) {
      console.warn('Reset email failed:', emailErr.message);
    }

    res.json({ success: true, message: 'If an account exists, a reset email has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/users/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!getIsConnected()) {
      return res.json({ success: true, message: 'Password reset (mock mode)!' });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/users/profile (protected)
export const getUserProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const mockUser = mockUsers.find(u => u._id === req.user.id);
      if (mockUser) {
        return res.json({ success: true, profile: mockUser });
      }
      return res.json({
        success: true,
        profile: {
          _id: req.user.id,
          name: 'User',
          email: req.user.email,
          ecoCoins: 0,
          totalTrips: 0,
          totalDistance: 0,
          carbonSaved: 0,
          role: 'user',
        },
      });
    }

    const user = await User.findById(req.user.id).select('-password -verificationToken -resetPasswordToken');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, profile: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/users/profile (protected)
export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!getIsConnected()) {
      return res.json({
        success: true,
        profile: { id: req.user.id, name: name || 'User', email: req.user.email, ecoCoins: 0, role: 'user' },
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    await user.save();

    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        ecoCoins: user.ecoCoins,
        totalTrips: user.totalTrips,
        totalDistance: user.totalDistance,
        carbonSaved: user.carbonSaved,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
