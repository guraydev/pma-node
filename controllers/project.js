const models = require('../models');
const logger = require('../utils/logger');

const createProject = async (req, res) => {
  const { name } = req.body;
  try {
    console.log('createProject: Creating project with name=', name, 'ownerId=', req.user.id);
    const project = await models.Project.create({
      name,
      ownerId: req.user.id,
    });
    logger.info(`Created project ${project.id} by user ${req.user.id}`);
    res.status(201).json(project);
  } catch (error) {
    logger.error(`Failed to create project: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProjects = async (req, res) => {
  try {
    console.log('getProjects: Fetching projects for userId=', req.user.id);
    const projects = await models.Project.findAll({
      where: { ownerId: req.user.id },
    });
    res.status(200).json(projects);
  } catch (error) {
    logger.error(`Failed to get projects: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  const { name } = req.body;
  try {
    console.log('updateProject: Updating projectId=', req.params.id);
    const project = await models.Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.update({ name });
    logger.info(`Updated project ${project.id} by user ${req.user.id}`);
    res.status(200).json(project);
  } catch (error) {
    logger.error(`Failed to update project: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    console.log('deleteProject: Deleting projectId=', req.params.id);
    const project = await models.Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.destroy();
    logger.info(`Deleted project ${req.params.id} by user ${req.user.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete project: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };