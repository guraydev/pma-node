const models = require('../models');
const logger = require('../utils/logger');

// Fetch dashboard data for chart (project and task counts by status)
const getDashboardData = async (req, res) => {
  try {
    const projects = await models.Project.count();
    const tasks = await models.Task.findAll({
      attributes: ['status', [models.Task.sequelize.fn('COUNT', models.Task.sequelize.col('status')), 'count']],
      group: ['status'],
    });
    const data = {
      projects,
      tasks: tasks.reduce((acc, task) => {
        acc[task.status] = task.get('count');
        return acc;
      }, { pending: 0, in_progress: 0, completed: 0 }),
    };
    logger.info(`Fetched dashboard data for user ${req.user.id}`);
    res.json(data);
  } catch (error) {
    logger.error(`Failed to fetch dashboard data: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getDashboardData };