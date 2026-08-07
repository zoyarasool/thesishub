const mongoose = require('mongoose');

const supervisionRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    meetingDate: { type: Date },
    meetingTime: { type: String },
    responseMessage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupervisionRequest', supervisionRequestSchema);