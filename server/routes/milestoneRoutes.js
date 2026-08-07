const express = require('express');
const {
  createMilestone,
  getProjectMilestones,
  updateMilestone,
  deleteMilestone,
} = require('../controllers/milestoneController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('supervisor'), createMilestone);
router.get('/:projectId', protect, getProjectMilestones);
router.put('/:id', protect, updateMilestone);
router.delete('/:id', protect, authorize('supervisor'), deleteMilestone);

module.exports = router;