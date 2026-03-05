const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects
} = require('../controllers/projectController');

router.route('/')
  .get(getProjects)
  .post(createProject);

router.get('/featured', getFeaturedProjects);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;