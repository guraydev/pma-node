const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/roleAuth');
const userController = require('../controllers/user');

// Apply authentication and role restriction
router.use(auth);
router.use(restrictTo(['admin']));

// Get all users
router.get('/', userController.getUsers);

module.exports = router;