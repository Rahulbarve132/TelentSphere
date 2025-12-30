const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { validate, authLimiter, passwordResetLimiter, authenticate } = require('../middleware');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } = require('../validations');

// Public routes with rate limiting
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authLimiter, authController.resendVerification);
router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', passwordResetLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
