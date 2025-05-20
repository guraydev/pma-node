const express = require('express');
const router = express.Router();
const { validateUser } = require('../middlewares/validate');
const { register, login } = require('../controllers/auth');

// Register a new user
router.post('/register', validateUser, register);

// Login a user
router.post('/login', login);

module.exports = router;