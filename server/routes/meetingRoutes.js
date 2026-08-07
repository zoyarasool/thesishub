const express = require('express');
const {
  createMeeting,
  getProjectMeetings,
  updateMeeting,
  deleteMeeting,
} = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('supervisor'), createMeeting);
router.get('/:projectId', protect, getProjectMeetings);
router.put('/:id', protect, authorize('supervisor'), updateMeeting);
router.delete('/:id', protect, authorize('supervisor'), deleteMeeting);

module.exports = router;