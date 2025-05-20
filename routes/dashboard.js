const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboard');

// Apply authentication middleware
router.use(auth);

// Get dashboard data
router.get('/', dashboardController.getDashboardData);

module.exports = router;