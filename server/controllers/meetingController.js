const Meeting = require('../models/Meeting');
const Project = require('../models/Project');

const createMeeting = async (req, res) => {
  try {
    const { projectId, date, time, agenda } = req.body;

    const project = await Project.findById(projectId);
    if (!project || project.supervisor?.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const meeting = await Meeting.create({
      project: projectId,
      scheduledBy: req.user._id,
      date,
      time,
      agenda,
    });

    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectMeetings = async (req, res) => {
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

    const meetings = await Meeting.find({ project: req.params.projectId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('project');
    if (!meeting || meeting.project.supervisor?.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const { date, time, agenda, notes, status } = req.body;
    if (date !== undefined) meeting.date = date;
    if (time !== undefined) meeting.time = time;
    if (agenda !== undefined) meeting.agenda = agenda;
    if (notes !== undefined) meeting.notes = notes;
    if (status !== undefined) meeting.status = status;

    await meeting.save();
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('project');
    if (!meeting || meeting.project.supervisor?.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    await meeting.deleteOne();
    res.status(200).json({ success: true, message: 'Meeting deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createMeeting, getProjectMeetings, updateMeeting, deleteMeeting };