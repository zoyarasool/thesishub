const SupervisionRequest = require('../models/SupervisionRequest');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc Student sends a supervision request
const sendRequest = async (req, res) => {
  try {
    const { projectId, supervisorId } = req.body;

    const project = await Project.findById(projectId);
    if (!project || project.student.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const request = await SupervisionRequest.create({
      project: projectId,
      student: req.user._id,
      supervisor: supervisorId,
    });

    project.status = 'pending';
    project.supervisor = supervisorId;
    await project.save();

    await Notification.create({
      user: supervisorId,
      message: `New supervision request from ${req.user.fullName}`,
      type: 'request_received',
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Supervisor views requests (filterable by status)
const getMyRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { supervisor: req.user._id };
    if (status) filter.status = status;

    const requests = await SupervisionRequest.find(filter)
      .populate('student', 'fullName studentId department')
      .populate('project');

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Supervisor approves or rejects a request
const respondToRequest = async (req, res) => {
  try {
    const { status, meetingDate, meetingTime, responseMessage } = req.body;

    const request = await SupervisionRequest.findById(req.params.id);
    if (!request || request.supervisor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;
    if (status === 'approved') {
      request.meetingDate = meetingDate;
      request.meetingTime = meetingTime;
    }
    request.responseMessage = responseMessage;
    await request.save();

    const project = await Project.findById(request.project);
    project.status = status === 'approved' ? 'approved' : 'rejected';
    await project.save();

    await Notification.create({
      user: request.student,
      message:
        status === 'approved'
          ? `Your supervision request was approved. Meeting scheduled on ${meetingDate} at ${meetingTime}.`
          : `Your supervision request was rejected.`,
      type: status === 'approved' ? 'request_approved' : 'request_rejected',
    });

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendRequest, getMyRequests, respondToRequest };