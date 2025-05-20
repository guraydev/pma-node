const cron = require('node-cron');
const { Op } = require('sequelize');
const Task = require('../models/task');
const User = require('../models/user');
const { sendEmail } = require('./email');
const logger = require('./logger');

// Schedule daily notifications for tasks due tomorrow
const scheduleDeadlineNotifications = () => {
  cron.schedule('0 8 * * *', async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

      const tasks = await Task.findAll({
        where: {
          dueDate: {
            [Op.gte]: tomorrow,
            [Op.lt]: dayAfterTomorrow,
          },
          assigneeId: { [Op.ne]: null },
        },
        include: [{ model: User, as: 'assignee' }],
      });

      for (const task of tasks) {
        await sendEmail(
          task.assignee.email,
          'Task Deadline Approaching',
          `The task "${task.title}" is due on ${new Date(task.dueDate).toLocaleDateString()}.`
        );
        logger.info(`Sent deadline notification for task ${task.id} to ${task.assignee.email}`);
      }
    } catch (error) {
      logger.error(`Failed to send deadline notifications: ${error.message}`);
    }
  });
  logger.info('Scheduled deadline notifications');
};

module.exports = { scheduleDeadlineNotifications };