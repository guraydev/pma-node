'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Project, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
      User.hasMany(models.Task, { foreignKey: 'assigneeId', onDelete: 'SET NULL' });
      User.hasMany(models.Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'manager', 'developer'),
        defaultValue: 'developer',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};