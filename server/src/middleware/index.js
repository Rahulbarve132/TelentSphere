const { authenticate, authorize, optionalAuth } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');
const validate = require('./validate');
const { uploadAvatar, uploadResume } = require('./upload');
const { apiLimiter, authLimiter, passwordResetLimiter, emailLimiter } = require('./rateLimiter');

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  errorHandler,
  notFound,
  validate,
  uploadAvatar,
  uploadResume,
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  emailLimiter,
};
