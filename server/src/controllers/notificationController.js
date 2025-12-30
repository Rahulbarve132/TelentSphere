const { Notification } = require('../models');
const { AppError, catchAsync } = require('../utils');

/**
 * @desc    Get my notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, isRead } = req.query;
  const query = { user: req.user._id };
  if (isRead !== undefined) query.isRead = isRead === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
    Notification.countDocuments(query),
    Notification.getUnreadCount(req.user._id),
  ]);

  res.status(200).json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    },
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return next(AppError.notFound('Notification not found'));
  if (notification.user.toString() !== req.user._id.toString()) {
    return next(AppError.forbidden('You can only update your own notifications'));
  }
  await notification.markAsRead();
  res.status(200).json({ success: true, message: 'Notification marked as read', data: { notification } });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.markAllAsRead(req.user._id);
  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return next(AppError.notFound('Notification not found'));
  if (notification.user.toString() !== req.user._id.toString()) {
    return next(AppError.forbidden('You can only delete your own notifications'));
  }
  await Notification.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Notification deleted successfully' });
});

/**
 * @desc    Get unread count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
const getUnreadCount = catchAsync(async (req, res, next) => {
  const count = await Notification.getUnreadCount(req.user._id);
  res.status(200).json({ success: true, data: { unreadCount: count } });
});

/**
 * @desc    Create notification (admin)
 * @route   POST /api/notifications
 * @access  Private/Admin
 */
const createNotification = catchAsync(async (req, res, next) => {
  const { userId, type, title, message, data, priority } = req.body;
  const notification = await Notification.create({
    user: userId, type: type || 'system', title, message, data, priority: priority || 'medium',
  });
  res.status(201).json({ success: true, message: 'Notification created', data: { notification } });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createNotification,
};
