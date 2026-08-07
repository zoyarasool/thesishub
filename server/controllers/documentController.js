const Document = require('../models/Document');
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project || project.student.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const document = await Document.create({
      project: projectId,
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.filename,
      fileSize: req.file.size,
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectDocuments = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isStudent = project.student.toString() === req.user._id.toString();
    const isSupervisor = project.supervisor?.toString() === req.user._id.toString();
    if (!isStudent && !isSupervisor) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const documents = await Document.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', document.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();
    res.status(200).json({ success: true, message: 'Document deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadDocument, getProjectDocuments, deleteDocument };