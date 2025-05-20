const models = require('../models');

const isProjectOwnerByProjectId = async (req, res, next) => {
  console.log('isProjectOwnerByProjectId: projectId=', req.params.projectId, 'user=', req.user ? req.user.id : 'no user');
  try {
    if (!req.params.projectId) {
      console.log('isProjectOwnerByProjectId: Missing projectId');
      return res.status(400).json({ error: 'Project ID is required' });
    }
    const project = await models.Project.findByPk(req.params.projectId);
    console.log('isProjectOwnerByProjectId: project=', project ? project.id : 'null');
    if (!project) {
      console.log('isProjectOwnerByProjectId: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.ownerId !== req.user.id) {
      console.log('isProjectOwnerByProjectId: Forbidden, ownerId=', project.ownerId, 'userId=', req.user.id);
      return res.status(403).json({ error: 'Forbidden: You do not own this project' });
    }
    next();
  } catch (error) {
    console.log('isProjectOwnerByProjectId: Error=', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const isProjectOwner = async (req, res, next) => {
  console.log('isProjectOwner: id=', req.params.id, 'user=', req.user ? req.user.id : 'no user');
  try {
    if (!req.params.id) {
      console.log('isProjectOwner: Missing project id');
      return res.status(400).json({ error: 'Project ID is required' });
    }
    const project = await models.Project.findByPk(req.params.id);
    console.log('isProjectOwner: project=', project ? project.id : 'null');
    if (!project) {
      console.log('isProjectOwner: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.ownerId !== req.user.id) {
      console.log('isProjectOwner: Forbidden, ownerId=', project.ownerId, 'userId=', req.user.id);
      return res.status(403).json({ error: 'Forbidden: You do not own this project' });
    }
    next();
  } catch (error) {
    console.log('isProjectOwner: Error=', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const isTaskProjectOwner = async (req, res, next) => {
  console.log('isTaskProjectOwner: taskId=', req.params.taskId, 'projectId=', req.params.projectId, 'user=', req.user ? req.user.id : 'no user');
  try {
    if (!req.params.taskId || !req.params.projectId) {
      console.log('isTaskProjectOwner: Missing taskId or projectId');
      return res.status(400).json({ error: 'Task ID and Project ID are required' });
    }
    const task = await models.Task.findByPk(req.params.taskId);
    console.log('isTaskProjectOwner: task=', task ? { id: task.id, projectId: task.projectId } : 'null');
    if (!task) {
      console.log('isTaskProjectOwner: Task not found');
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.projectId != req.params.projectId) {
      console.log('isTaskProjectOwner: Task projectId mismatch, task.projectId=', task.projectId, 'req.params.projectId=', req.params.projectId);
      return res.status(400).json({ error: 'Task does not belong to the specified project' });
    }
    const project = await models.Project.findByPk(task.projectId);
    console.log('isTaskProjectOwner: project=', project ? project.id : 'null');
    if (!project) {
      console.log('isTaskProjectOwner: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.ownerId !== req.user.id) {
      console.log('isTaskProjectOwner: Forbidden, ownerId=', project.ownerId, 'userId=', req.user.id);
      return res.status(403).json({ error: 'Forbidden: You do not own this project' });
    }
    req.task = task;
    next();
  } catch (error) {
    console.log('isTaskProjectOwner: Error=', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { isProjectOwner, isTaskProjectOwner, isProjectOwnerByProjectId };