const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Users management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

// Jobs management
router.get('/jobs', adminController.getAllJobs);
router.put('/jobs/:id/moderate', adminController.moderateJob);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Broadcast notification
router.post('/broadcast', adminController.broadcastNotification);

module.exports = router;
