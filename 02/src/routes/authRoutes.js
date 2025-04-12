const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);

// Google auth route
router.post('/google', authController.googleAuth);

// Health check
// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Auth service is running', 
      timestamp: new Date().toISOString() 
    });
  });

module.exports = router;