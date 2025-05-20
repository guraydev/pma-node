const jwt = require('jsonwebtoken');
const models = require('../models');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    console.log('Auth: Models=', Object.keys(models));
    console.log('Auth: User model=', models.User ? 'Present' : 'Missing');
    console.log('Auth: User.findByPk=', models.User ? typeof models.User.findByPk : 'undefined');
    if (!models.User || !models.User.findByPk) {
      throw new Error('User model or User.findByPk is not defined');
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth: Decoded JWT=', decoded);

    const user = await models.User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    logger.info(`Authenticated user: ${user.username}`);
    next();
  } catch (error) {
    logger.error(`Auth: Error= ${error.message}`);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;