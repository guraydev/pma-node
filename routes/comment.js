const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/auth');
const { isTaskProjectOwner } = require('../middlewares/projectAuth');
const { validateComment, validateId, validateTaskId } = require('../middlewares/validate');
const commentController = require('../controllers/comment');

// Log incoming requests
router.use((req, res, next) => {
  console.log(`Comment route: ${req.method} /projects/${req.params.projectId}/tasks/${req.params.taskId}/comments${req.params.id ? '/' + req.params.id : ''}`);
  console.log('Body:', req.body);
  console.log('User:', req.user ? req.user.id : 'no user');
  next();
});

router.use(auth);
router.use(validateTaskId);
router.use(isTaskProjectOwner);

router.get('/', commentController.getComments);
router.post('/', validateComment, commentController.createComment);
router.delete('/:id', validateId, commentController.deleteComment);

module.exports = router;