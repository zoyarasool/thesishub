const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Thesis title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Thesis idea/description is required'],
    },
    department: {
      type: String,
      enum: ['AI', 'SE', 'CS', 'CYB', 'IT'],
      required: true,
    },
    groupMembers: {
      type: [groupMemberSchema],
      default: [],
    },
    preferredTopics: {
      type: [String],
      default: [],
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['unassigned', 'pending', 'approved', 'rejected'],
      default: 'unassigned',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);