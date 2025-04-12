const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

/**
 * Protect routes - Authentication middleware
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token is in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check if token is in cookies
    else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Add user to req object
      req.user = await User.findById(decoded.id);
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};