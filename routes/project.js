const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { isProjectOwner } = require('../middlewares/projectAuth');
const { restrictTo } = require('../middlewares/roleAuth');
const { validateProject, validateId } = require('../middlewares/validate');
const projectController = require('../controllers/project');

// Apply authentication middleware
router.use(auth);

// Get all projects
router.get('/', projectController.getProjects);

// Create a project  (admin/manager only)
router.post('/', restrictTo(['admin', 'manager']), validateProject, projectController.createProject);

// Update a project (admin/manager, owner only)
router.put('/:id', restrictTo(['admin', 'manager']), isProjectOwner, validateId, validateProject, projectController.updateProject);

// Delete a project (admin/manager, owner only)
router.delete('/:id', restrictTo(['admin', 'manager']), isProjectOwner, validateId, projectController.deleteProject);

module.exports = router;