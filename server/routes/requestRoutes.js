const express = require('express');
const {
  sendRequest,
  getMyRequests,
  respondToRequest,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), sendRequest);
router.get('/', protect, authorize('supervisor'), getMyRequests);
router.put('/:id/respond', protect, authorize('supervisor'), respondToRequest);

module.exports = router;