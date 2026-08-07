const express = require('express');
const {
  createProject,
  getMyProjects,
  getAvailableSupervisors,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), createProject);
router.get('/my-projects', protect, authorize('student'), getMyProjects);
router.get('/supervisors', protect, authorize('student'), getAvailableSupervisors);

module.exports = router;