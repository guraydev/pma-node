const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Register a new user
const register = async (username, password, email, role = 'user') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword, email, role });
  return user;
};

// Login a user and return token and user details
const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
};

module.exports = { register, login };