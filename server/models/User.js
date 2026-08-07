const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const departments = ['AI', 'SE', 'CS', 'CYB', 'IT'];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'supervisor'],
      required: true,
    },
    department: {
      type: String,
      enum: departments,
      required: true,
    },
    // Student-only field
    studentId: {
      type: String,
      trim: true,
    },
    // Supervisor-only fields
    facultyId: {
      type: String,
      trim: true,
    },
    interestedTopics: {
      type: [String],
      default: [],
    },
    availableForSupervision: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);