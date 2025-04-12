const express = require('express');
const router = express.Router();
const analyzeRoutes = require('./analyzeRoutes');
const authRoutes = require('./authRoutes');

// Import controllers
const runController = require('../controllers/runController');
const formatController = require('../controllers/formatController');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add your routes here
router.use('/auth', authRoutes);
router.use('/analyze', analyzeRoutes);

// Run code endpoint
router.post('/run', runController.runCode);

// Format code endpoint
router.post('/format', formatController.formatCode);

module.exports = router;