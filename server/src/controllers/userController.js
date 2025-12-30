const fs = require('fs');
const path = require('path');
const { User, Profile } = require('../models');
const { AppError, catchAsync } = require('../utils');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, role, isVerified, isActive, search } = req.query;

  const query = {};

  if (role) query.role = role;
  if (isVerified !== undefined) query.isVerified = isVerified === 'true';
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  // Get profiles for users
  const userIds = users.map(u => u._id);
  const profiles = await Profile.find({ user: { $in: userIds } });
  const profileMap = profiles.reduce((acc, p) => {
    acc[p.user.toString()] = p;
    return acc;
  }, {});

  const usersWithProfiles = users.map(user => ({
    ...user.toJSON(),
    profile: profileMap[user._id.toString()] || null,
  }));

  res.status(200).json({
    success: true,
    data: {
      users: usersWithProfiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(AppError.notFound('User not found'));
  }

  const profile = await Profile.findOne({ user: user._id });

  res.status(200).json({
    success: true,
    data: {
      user,
      profile,
    },
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private
 */
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if user is updating their own account or is admin
  if (req.user._id.toString() !== id && req.user.role !== 'admin') {
    return next(AppError.forbidden('You can only update your own account'));
  }

  // Prevent role change unless admin
  if (req.body.role && req.user.role !== 'admin') {
    delete req.body.role;
  }

  // Prevent changing sensitive fields
  const forbiddenFields = ['password', 'email', 'verificationToken', 'resetPasswordToken', 'refreshToken'];
  forbiddenFields.forEach(field => delete req.body[field]);

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(AppError.notFound('User not found'));
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(AppError.notFound('User not found'));
  }

  // Prevent deleting admin accounts
  if (user.role === 'admin') {
    return next(AppError.forbidden('Cannot delete admin accounts'));
  }

  // Delete profile
  await Profile.findOneAndDelete({ user: id });

  // Delete user
  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id/profile
 * @access  Public
 */
const getProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(AppError.notFound('User not found'));
  }

  const profile = await Profile.findOne({ user: id }).populate('user', 'email role createdAt');

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  res.status(200).json({
    success: true,
    data: { profile },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if user is updating their own profile
  if (req.user._id.toString() !== id && req.user.role !== 'admin') {
    return next(AppError.forbidden('You can only update your own profile'));
  }

  let profile = await Profile.findOne({ user: id });

  if (!profile) {
    // Create profile if it doesn't exist
    profile = await Profile.create({ user: id, ...req.body });
  } else {
    // Update existing profile
    Object.assign(profile, req.body);
    await profile.save();
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { profile },
  });
});

/**
 * @desc    Add experience
 * @route   POST /api/users/:id/profile/experience
 * @access  Private
 */
const addExperience = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id) {
    return next(AppError.forbidden('You can only update your own profile'));
  }

  const profile = await Profile.findOne({ user: id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  profile.experience.unshift(req.body.experience);
  await profile.save();

  res.status(201).json({
    success: true,
    message: 'Experience added successfully',
    data: { profile },
  });
});

/**
 * @desc    Delete experience
 * @route   DELETE /api/users/:id/profile/experience/:expId
 * @access  Private
 */
const deleteExperience = catchAsync(async (req, res, next) => {
  const { id, expId } = req.params;

  if (req.user._id.toString() !== id) {
    return next(AppError.forbidden('You can only update your own profile'));
  }

  const profile = await Profile.findOne({ user: id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  profile.experience = profile.experience.filter(
    exp => exp._id.toString() !== expId
  );
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Experience removed successfully',
    data: { profile },
  });
});

/**
 * @desc    Add education
 * @route   POST /api/users/:id/profile/education
 * @access  Private
 */
const addEducation = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id) {
    return next(AppError.forbidden('You can only update your own profile'));
  }

  const profile = await Profile.findOne({ user: id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  profile.education.unshift(req.body.education);
  await profile.save();

  res.status(201).json({
    success: true,
    message: 'Education added successfully',
    data: { profile },
  });
});

/**
 * @desc    Delete education
 * @route   DELETE /api/users/:id/profile/education/:eduId
 * @access  Private
 */
const deleteEducation = catchAsync(async (req, res, next) => {
  const { id, eduId } = req.params;

  if (req.user._id.toString() !== id) {
    return next(AppError.forbidden('You can only update your own profile'));
  }

  const profile = await Profile.findOne({ user: id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  profile.education = profile.education.filter(
    edu => edu._id.toString() !== eduId
  );
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Education removed successfully',
    data: { profile },
  });
});

/**
 * @desc    Upload avatar
 * @route   POST /api/users/:id/avatar
 * @access  Private
 */
const uploadAvatar = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id) {
    return next(AppError.forbidden('You can only update your own profile'));
  }

  if (!req.file) {
    return next(AppError.badRequest('Please upload an image'));
  }

  const profile = await Profile.findOne({ user: id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  // Delete old avatar if exists
  if (profile.avatar) {
    const oldPath = path.join(process.cwd(), profile.avatar);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // Save new avatar path
  profile.avatar = `uploads/avatars/${req.file.filename}`;
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      avatar: profile.avatar,
    },
  });
});

/**
 * @desc    Delete avatar
 * @route   DELETE /api/users/:id/avatar
 * @access  Private
 */
const deleteAvatar = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id) {
    return next(AppError.forbidden('You can only update your own profile'));
  }

  const profile = await Profile.findOne({ user: id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  if (profile.avatar) {
    const avatarPath = path.join(process.cwd(), profile.avatar);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
    profile.avatar = null;
    await profile.save();
  }

  res.status(200).json({
    success: true,
    message: 'Avatar deleted successfully',
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  uploadAvatar,
  deleteAvatar,
};
