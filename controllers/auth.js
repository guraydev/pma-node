const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../models');
const logger = require('../utils/logger');

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    console.log('Register: Models=', Object.keys(models));
    console.log('Register: User model=', models.User ? 'Present' : 'Missing');
    console.log('Register: User.create=', models.User ? typeof models.User.create : 'undefined');
    if (!models.User || !models.User.create) {
      throw new Error('User model or User.create is not defined');
    }
    console.log('Register: Creating user with', { username, email, role });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'developer',
    });
    logger.info(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username, email, role: user.role } });
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    res.status(500).json({ error: `Registration failed: ${error.message}` });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Login: Models=', Object.keys(models));
    console.log('Login: User model=', models.User ? 'Present' : 'Missing');
    console.log('Login: User.findOne=', models.User ? typeof models.User.findOne : 'undefined');
    if (!models.User || !models.User.findOne) {
      throw new Error('User model or User.findOne is not defined');
    }
    console.log('Login: Finding user with username=', username);
    const user = await models.User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`User logged in: ${username}`);
    res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    res.status(500).json({ error: `Login failed: ${error.message}` });
  }
};

module.exports = { register, login };