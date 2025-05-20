const models = require('../models');
const logger = require('../utils/logger');

const createComment = async (req, res) => {
  const { content } = req.body;
  try {
    console.log('createComment: Creating comment for taskId=', req.params.taskId);
    const comment = await models.Comment.create({
      content,
      taskId: req.params.taskId,
      userId: req.user.id,
    });
    logger.info(`Created comment ${comment.id} for task ${req.params.taskId} by user ${req.user.id}`);
    res.status(201).json(comment);
  } catch (error) {
    logger.error(`Failed to create comment: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const getComments = async (req, res) => {
  try {
    console.log('getComments: Fetching comments for taskId=', req.params.taskId);
    const comments = await models.Comment.findAll({
      where: { taskId: req.params.taskId },
    });
    res.status(200).json(comments);
  } catch (error) {
    logger.error(`Failed to get comments: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    console.log('deleteComment: Deleting commentId=', req.params.id);
    const comment = await models.Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this comment' });
    }
    await comment.destroy();
    logger.info(`Deleted comment ${req.params.id} by user ${req.user.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete comment: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createComment, getComments, deleteComment };