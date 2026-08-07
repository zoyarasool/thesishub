const Milestone = require('../models/Milestone');
const Project = require('../models/Project');

const createMilestone = async (req, res) => {
  try {
    const { projectId, title, description, dueDate, order } = req.body;

    const project = await Project.findById(projectId);
    if (!project || project.supervisor?.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const milestone = await Milestone.create({
      project: projectId,
      title,
      description,
      dueDate,
      order,
    });

    res.status(201).json({ success: true, data: milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectMilestones = async (req, res) => {
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

    const milestones = await Milestone.find({ project: req.params.projectId }).sort({ order: 1 });
    res.status(200).json({ success: true, data: milestones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id).populate('project');
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const isStudent = milestone.project.student.toString() === req.user._id.toString();
    const isSupervisor = milestone.project.supervisor?.toString() === req.user._id.toString();
    if (!isStudent && !isSupervisor) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (isSupervisor) {
      const { title, description, dueDate, status, order } = req.body;
      if (title !== undefined) milestone.title = title;
      if (description !== undefined) milestone.description = description;
      if (dueDate !== undefined) milestone.dueDate = dueDate;
      if (status !== undefined) milestone.status = status;
      if (order !== undefined) milestone.order = order;
    } else {
      if (req.body.status !== undefined) milestone.status = req.body.status;
    }

    await milestone.save();
    res.status(200).json({ success: true, data: milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id).populate('project');
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    if (milestone.project.supervisor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await milestone.deleteOne();
    res.status(200).json({ success: true, message: 'Milestone deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createMilestone, getProjectMilestones, updateMilestone, deleteMilestone };