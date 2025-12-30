const express = require('express');
const router = express.Router();
const { notificationController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Get notifications
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

// Mark as read
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Admin: Create notification
router.post('/', authorize('admin'), notificationController.createNotification);

module.exports = router;
