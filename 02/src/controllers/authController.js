const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed in the User model pre-save hook
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Remove password from response
    user.password = undefined;
    
    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Remove password from response
    user.password = undefined;
    
    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
exports.logout = async (req, res, next) => {
  try {
    // In a stateless JWT auth system, the client is responsible for discarding the token
    // Server-side, we could implement a token blacklist if needed
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updatedFields = {};
    
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Google Authentication
 */
exports.googleAuth = async (req, res, next) => {
  try {
    // Get token from request body
    const { token: googleToken } = req.body;
    
    if (!googleToken) {
      return res.status(400).json({ message: 'No Google token provided' });
    }
    
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    // Get user info from Google payload
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    if (!email) {
      return res.status(400).json({ message: 'Google did not provide an email' });
    }
    
    console.log('Google authentication for:', email);
    
    // Check if user exists in database
    let user = await User.findOne({ email });
    
    // If not, create new user
    if (!user) {
      user = await User.create({
        email,
        name,
        photoURL: picture,
        googleId,
        password: crypto.randomBytes(16).toString('hex') // Random password for Google auth users
      });
      console.log('New user created:', user.email);
    } 
    // If user exists but doesn't have googleId, update it
    else if (!user.googleId) {
      user.googleId = googleId;
      user.photoURL = picture || user.photoURL;
      await user.save();
      console.log('Updated existing user with Google ID:', user.email);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Remove password from response
    user.password = undefined;
    
    // Return user data and token
    res.status(200).json({
      success: true,
      user,
      token,
    });
    
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ 
      message: 'Google authentication failed', 
      error: error.message 
    });
  }
};

/**
 * Health check endpoint
 */
exports.health = async (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Auth service is running' });
};