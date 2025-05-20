const { body, param, validationResult } = require('express-validator');

// Generic validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate user data
const validateUser = [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
  validate,
];

// Validate project data
const validateProject = [
  body('name').isString().notEmpty().withMessage('Project name is required'),
  body('description').optional().isString(),
  validate,
];

// Validate task data
const validateTask = [
  body('title').isString().notEmpty().withMessage('Task title is required'),
  body('description').optional().isString(),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('assigneeId').optional().isInt().withMessage('Assignee ID must be an integer'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  validate,
];

// Validate comment data
const validateComment = [
  body('content').isString().notEmpty().withMessage('Comment content is required'),
  validate,
];

// Validate ID parameter
const validateId = [
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
];

// Validate taskId parameter
const validateTaskId = [
  param('taskId').isInt().withMessage('Task ID must be an integer'),
  validate,
];

module.exports = {
  validateUser,
  validateProject,
  validateTask,
  validateComment,
  validateId,
  validateTaskId,
};