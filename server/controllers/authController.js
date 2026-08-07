const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, department, studentId, facultyId, interestedTopics, availableForSupervision } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role,
      department,
      studentId: role === 'student' ? studentId : undefined,
      facultyId: role === 'supervisor' ? facultyId : undefined,
      interestedTopics: role === 'supervisor' ? interestedTopics : undefined,
      availableForSupervision: role === 'supervisor' ? availableForSupervision : undefined,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        facultyId: user.facultyId,
        interestedTopics: user.interestedTopics,
        availableForSupervision: user.availableForSupervision,
        accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        facultyId: user.facultyId,
        interestedTopics: user.interestedTopics,
        availableForSupervision: user.availableForSupervision,
        accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'department'];
    if (req.user.role === 'supervisor') {
      allowedFields.push('interestedTopics', 'availableForSupervision');
    }

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        facultyId: user.facultyId,
        interestedTopics: user.interestedTopics,
        availableForSupervision: user.availableForSupervision,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete own account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, updateProfile, changePassword, deleteAccount };