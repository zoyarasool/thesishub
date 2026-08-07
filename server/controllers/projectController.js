const Project = require('../models/Project');
const User = require('../models/User');

// @desc Student creates a thesis project
const createProject = async (req, res) => {
  try {
    const { title, description, groupMembers, preferredTopics } = req.body;

    const project = await Project.create({
      student: req.user._id,
      title,
      description,
      department: req.user.department,
      groupMembers,
      preferredTopics,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get logged-in student's own project(s)
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ student: req.user._id }).populate(
      'supervisor',
      'fullName facultyId department'
    );
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get list of available supervisors (with optional filters)
const getAvailableSupervisors = async (req, res) => {
  try {
    const { department, topic } = req.query;

    const filter = { role: 'supervisor', availableForSupervision: true };
    if (department) filter.department = department;
    if (topic) filter.interestedTopics = { $regex: topic, $options: 'i' };

    const supervisors = await User.find(filter).select(
      'fullName facultyId department interestedTopics availableForSupervision'
    );

    res.status(200).json({ success: true, data: supervisors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProject, getMyProjects, getAvailableSupervisors };