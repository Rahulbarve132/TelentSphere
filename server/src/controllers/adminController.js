const { User, Job, Application, Profile, Notification } = require('../models');
const { AppError, catchAsync } = require('../utils');
const { notificationService } = require('../services');

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getDashboard = catchAsync(async (req, res, next) => {
  const [totalUsers, totalJobs, totalApplications, recentUsers, recentJobs] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5),
    Job.find().sort({ createdAt: -1 }).limit(5).populate('postedBy', 'email'),
  ]);

  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);

  const applicationsByStatus = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const jobsByStatus = await Job.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: { totalUsers, totalJobs, totalApplications },
      usersByRole,
      applicationsByStatus,
      jobsByStatus,
      recentUsers,
      recentJobs,
    },
  });
});

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, role, isActive, search } = req.query;
  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) query.email = { $regex: search, $options: 'i' };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    },
  });
});

/**
 * @desc    Update user status
 * @route   PUT /api/admin/users/:id/status
 * @access  Private/Admin
 */
const updateUserStatus = catchAsync(async (req, res, next) => {
  const { isActive, isVerified } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return next(AppError.notFound('User not found'));
  if (user.role === 'admin') return next(AppError.forbidden('Cannot modify admin status'));

  if (isActive !== undefined) user.isActive = isActive;
  if (isVerified !== undefined) user.isVerified = isVerified;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'User status updated', data: { user } });
});

/**
 * @desc    Get all jobs (admin)
 * @route   GET /api/admin/jobs
 * @access  Private/Admin
 */
const getAllJobs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [jobs, total] = await Promise.all([
    Job.find(query).populate('postedBy', 'email').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      jobs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    },
  });
});

/**
 * @desc    Moderate job
 * @route   PUT /api/admin/jobs/:id/moderate
 * @access  Private/Admin
 */
const moderateJob = catchAsync(async (req, res, next) => {
  const { status, isFeatured } = req.body;
  const job = await Job.findById(req.params.id);
  if (!job) return next(AppError.notFound('Job not found'));

  if (status) job.status = status;
  if (isFeatured !== undefined) job.isFeatured = isFeatured;
  await job.save();

  res.status(200).json({ success: true, message: 'Job moderated', data: { job } });
});

/**
 * @desc    Get platform analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
const getAnalytics = catchAsync(async (req, res, next) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [newUsersLast30Days, newJobsLast30Days, applicationsLast30Days, jobsByCategory] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Application.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Job.aggregate([
      { $match: { status: 'open' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      last30Days: { newUsers: newUsersLast30Days, newJobs: newJobsLast30Days, applications: applicationsLast30Days },
      jobsByCategory,
    },
  });
});

/**
 * @desc    Broadcast notification
 * @route   POST /api/admin/broadcast
 * @access  Private/Admin
 */
const broadcastNotification = catchAsync(async (req, res, next) => {
  const { title, message, link, role } = req.body;
  const query = { isActive: true };
  if (role) query.role = role;

  const users = await User.find(query).select('_id');
  const userIds = users.map(u => u._id);

  await notificationService.broadcastNotification(userIds, title, message, link, req.user._id);
  res.status(200).json({ success: true, message: `Broadcast sent to ${userIds.length} users` });
});

/**
 * @desc    Get broadcast statistics for the logged-in admin
 * @route   GET /api/admin/broadcast/stats
 * @access  Private/Admin
 */
const getBroadcastStats = catchAsync(async (req, res, next) => {
  const stats = await Notification.aggregate([
    {
      $match: {
        type: 'admin_broadcast',
        'data.fromUserId': req.user._id,
      },
    },
    {
      $group: {
        _id: {
          title: '$title',
          createdAt: '$createdAt', // Assuming accurate timestamps for the batch
        },
        recipientCount: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.createdAt': -1 },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalBroadcasts: stats.length,
      totalRecipients: stats.reduce((acc, curr) => acc + curr.recipientCount, 0),
      history: stats.map(s => ({
        title: s._id.title,
        sentAt: s._id.createdAt,
        recipients: s.recipientCount,
      })),
    },
  });
});

module.exports = {
  getDashboard,
  getAllUsers,
  updateUserStatus,
  getAllJobs,
  moderateJob,
  getAnalytics,
  broadcastNotification,
  getBroadcastStats,
};
