'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Task, { foreignKey: 'taskId', onDelete: 'CASCADE' });
      Comment.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  Comment.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );

  return Comment;
};