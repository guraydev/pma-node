'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

console.log('Initializing Sequelize with config:', config);

let sequelize;
try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
  console.log('Sequelize initialized successfully');
} catch (error) {
  console.error('Sequelize initialization failed:', error.message);
  throw error;
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    const isValid = (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    console.log(`Checking file: ${file}, isValid: ${isValid}`);
    return isValid;
  })
  .forEach(file => {
    try {
      console.log(`Loading model: ${file}`);
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      console.log(`Model loaded: ${model.name}`);
      db[model.name] = model;
    } catch (error) {
      console.error(`Failed to load model ${file}:`, error.message);
    }
  });

Object.keys(db).forEach(modelName => {
  try {
    console.log(`Setting associations for: ${modelName}`);
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  } catch (error) {
    console.error(`Failed to set associations for ${modelName}:`, error.message);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('Models loaded:', Object.keys(db));
console.log('User model:', db.User ? 'Present' : 'Missing');
if (db.User) {
  console.log('User.create:', typeof db.User.create);
  console.log('User.findByPk:', typeof db.User.findByPk);
}

module.exports = db;