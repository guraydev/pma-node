'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
      Task.belongsTo(models.User, { foreignKey: 'assigneeId', onDelete: 'SET NULL' });
      Task.hasMany(models.Comment, { foreignKey: 'taskId', onDelete: 'CASCADE' });
    }
  }

  Task.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending',
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigneeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );

  return Task;
};