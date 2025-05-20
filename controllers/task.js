const models = require('../models');
const logger = require('../utils/logger');
const { sendEmail } = require('../utils/email');

const getTasks = async (req, res) => {
  try {
    console.log('getTasks: Fetching tasks for projectId=', req.params.projectId);
    const tasks = await models.Task.findAll({
      where: { projectId: req.params.projectId },
    });
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Failed to get tasks: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, assigneeId, dueDate } = req.body;
  try {
    console.log('createTask: Creating task with', { title, projectId: req.params.projectId });
    const task = await models.Task.create({
      title,
      description,
      status: status || 'pending',
      projectId: req.params.projectId,
      assigneeId,
      dueDate,
    });
    if (assigneeId) {
      const assignee = await models.User.findByPk(assigneeId);
      if (assignee) {
        let emailText = `You have been assigned to task "${title}" in project ID ${task.projectId}.`;
        if (dueDate) {
          emailText += ` Due date: ${new Date(dueDate).toLocaleDateString()}.`;
        }
        await sendEmail(assignee.email, 'Task Assigned', emailText);
      }
    }
    logger.info(`Created task ${task.id} by user ${req.user.id}`);
    res.status(201).json(task);
  } catch (error) {
    logger.error(`Failed to create task: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, assigneeId, dueDate } = req.body;
  try {
    console.log('updateTask: Updating taskId=', req.params.id);
    const task = await models.Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.update({ title, description, status, assigneeId, dueDate });
    if (assigneeId && assigneeId !== task.assigneeId) {
      const assignee = await models.User.findByPk(assigneeId);
      if (!assignee) {
        return res.status(400).json({ error: 'Invalid assignee ID' });
      }
      let emailText = `Task "${title}" in project ID ${task.projectId} has been reassigned to you.`;
      if (dueDate) {
        emailText += ` Due date: ${new Date(dueDate).toLocaleDateString()}.`;
      }
      await sendEmail(assignee.email, 'Task Reassigned', emailText);
    }
    logger.info(`Updated task ${task.id} by user ${req.user.id}`);
    res.status(200).json(task);
  } catch (error) {
    logger.error(`Failed to update task: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    console.log('deleteTask: Deleting taskId=', req.params.id);
    const task = await models.Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    logger.info(`Deleted task ${req.params.id} by user ${req.user.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete task: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };