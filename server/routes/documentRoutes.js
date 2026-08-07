const express = require('express');
const { uploadDocument, getProjectDocuments, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

const router = express.Router();

router.post('/', protect, authorize('student'), upload.single('document'), uploadDocument);
router.get('/:projectId', protect, getProjectDocuments);
router.delete('/:id', protect, deleteDocument);

module.exports = router;