const models = require('../models');
const logger = require('../utils/logger');

const getUsers = async (req, res) => {
  try {
    console.log('getUsers: Fetching all users');
    const users = await models.User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'],
    });
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Failed to get users: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUsers };