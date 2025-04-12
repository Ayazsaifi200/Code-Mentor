const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/', analyzeController.analyzeCode);

// Protected routes (require authentication)
router.post('/detailed', authMiddleware.protect, analyzeController.detailedAnalysis);

module.exports = router;