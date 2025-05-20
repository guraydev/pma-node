const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/auth');
const { isProjectOwnerByProjectId, isTaskProjectOwner } = require('../middlewares/projectAuth');
const { restrictTo } = require('../middlewares/roleAuth');
const { validateTask, validateId } = require('../middlewares/validate');
const taskController = require('../controllers/task');

// Apply authentication middleware
router.use(auth);

// Log incoming requests
router.use((req, res, next) => {
  console.log(`Task route: ${req.method} /projects/${req.params.projectId}/tasks${req.params.id ? '/' + req.params.id : ''}`);
  console.log('Body:', req.body);
  console.log('User:', req.user ? req.user.id : 'no user');
  next();
});

// Get all tasks for a project
router.get('/', isProjectOwnerByProjectId, taskController.getTasks);

// Create a task (admin/manager only)
router.post('/', isProjectOwnerByProjectId, restrictTo(['admin', 'manager']), validateTask, taskController.createTask);

// Update a task (admin/manager only)
router.put('/:id', isTaskProjectOwner, restrictTo(['admin', 'manager']), validateId, validateTask, taskController.updateTask);

// Delete a task (admin/manager only)
router.delete('/:id', isTaskProjectOwner, restrictTo(['admin', 'manager']), validateId, taskController.deleteTask);

module.exports = router;