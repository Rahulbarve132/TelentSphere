const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError, catchAsync, verifyAccessToken } = require('../utils');

/**
 * Authentication middleware
 * Verifies JWT token from HTTP-only cookie
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Get token from cookie or Authorization header
  let token = req.cookies.accessToken;

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(AppError.unauthorized('Please log in to access this resource'));
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(AppError.unauthorized('User no longer exists'));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(AppError.forbidden('Your account has been deactivated'));
    }

    // Check if user is verified (skip in development for easier testing)
    if (!user.isVerified && process.env.NODE_ENV !== 'development') {
      return next(AppError.forbidden('Please verify your email to access this resource'));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Token expired. Please log in again'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(AppError.unauthorized('Invalid token. Please log in again'));
    }
    return next(error);
  }
});

/**
 * Authorization middleware factory
 * Checks if user has required role(s)
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Please log in to access this resource'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden('You do not have permission to perform this action')
      );
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't require it
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (user && user.isActive && user.isVerified) {
      req.user = user;
    }
  } catch (error) {
    // Token is invalid, but we don't throw an error for optional auth
  }

  next();
});

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
