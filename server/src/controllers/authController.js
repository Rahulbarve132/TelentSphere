const crypto = require('crypto');
const { User, Profile } = require('../models');
const { AppError, catchAsync, generateAccessToken, generateRefreshToken, verifyRefreshToken, setAuthCookies, clearAuthCookies } = require('../utils');
const { emailService, notificationService } = require('../services');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res, next) => {
  const { email, password, role, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(AppError.conflict('Email already registered'));
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const user = await User.create({
    email,
    password,
    role,
    verificationToken,
    verificationTokenExpiry,
  });

  // Create profile
  await Profile.create({
    user: user._id,
    firstName,
    lastName,
  });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(email, firstName, verificationToken);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // Don't fail registration if email fails
  }

  // Create welcome notification
  await notificationService.notifyWelcome(user._id, firstName);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    data: {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(AppError.unauthorized('Invalid email or password'));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(AppError.forbidden('Your account has been deactivated. Please contact support.'));
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Save refresh token to database
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Set cookies
  setAuthCookies(res, accessToken, refreshToken);

  // Get profile
  const profile = await Profile.findOne({ user: user._id });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      profile: profile ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: profile.avatar,
      } : null,
      accessToken, // Also send in response for clients that can't use cookies
    },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res, next) => {
  // Clear refresh token in database
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  // Clear cookies
  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    return next(AppError.unauthorized('No refresh token provided'));
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user with this refresh token
    const user = await User.findOne({ _id: decoded.id, refreshToken: token });

    if (!user) {
      return next(AppError.unauthorized('Invalid refresh token'));
    }

    if (!user.isActive) {
      return next(AppError.forbidden('Your account has been deactivated'));
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return next(AppError.unauthorized('Invalid or expired refresh token'));
  }
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email
 * @access  Public
 */
const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(AppError.badRequest('Verification token is required'));
  }

  // Find user with this token
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(AppError.badRequest('Invalid or expired verification token'));
  }

  // Verify user
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  // Send welcome email
  const profile = await Profile.findOne({ user: user._id });
  try {
    await emailService.sendWelcomeEmail(user.email, profile?.firstName || 'User');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }

  // Create notification
  await notificationService.notifyAccountVerified(user._id);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. You can now login.',
  });
});

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerification = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(AppError.notFound('No account found with this email'));
  }

  if (user.isVerified) {
    return next(AppError.badRequest('Email is already verified'));
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  // Get profile for name
  const profile = await Profile.findOne({ user: user._id });

  // Send verification email
  try {
    await emailService.sendVerificationEmail(email, profile?.firstName || 'User', verificationToken);
  } catch (error) {
    console.error('Error sending verification email:', error);
    return next(AppError.internal('Error sending verification email'));
  }

  res.status(200).json({
    success: true,
    message: 'Verification email sent successfully',
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  // Get profile for name
  const profile = await Profile.findOne({ user: user._id });

  // Send reset email
  try {
    await emailService.sendPasswordResetEmail(email, profile?.firstName || 'User', resetToken);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(AppError.internal('Error sending password reset email'));
  }

  res.status(200).json({
    success: true,
    message: 'If an account exists with this email, a password reset link has been sent.',
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(AppError.badRequest('Invalid or expired reset token'));
  }

  // Update password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  user.refreshToken = undefined; // Invalidate existing sessions
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please login with your new password.',
  });
});

/**
 * @desc    Change password (for logged in users)
 * @route   POST /api/auth/change-password
 * @access  Private
 */
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(AppError.unauthorized('Current password is incorrect'));
  }

  // Update password
  user.password = newPassword;
  user.refreshToken = undefined; // Invalidate existing sessions
  await user.save();

  // Generate new tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: {
      accessToken,
    },
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const profile = await Profile.findOne({ user: user._id });

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      profile,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
