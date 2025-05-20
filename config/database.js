const Sequelize = require('sequelize');
const config = require('./config')[process.env.NODE_ENV || 'development'];

// Log configuration for debugging
console.log('Database config:', {
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  port: config.port,
  dialect: config.dialect
});

// Initialize Sequelize with PostgreSQL configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: false, // Disable SQL query logging for cleaner console
});

module.exports = sequelize;