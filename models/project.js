'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
      Project.hasMany(models.Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
    }
  }

  Project.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Project',
    }
  );

  return Project;
};