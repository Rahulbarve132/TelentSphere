const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'application_received',
        'application_status_changed',
        'job_posted',
        'job_expired',
        'job_closed',
        'profile_viewed',
        'message_received',
        'account_verified',
        'password_reset',
        'welcome',
        'system',
        'admin_broadcast',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    data: {
      // Additional data related to the notification
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
      },
      fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      link: String,
      metadata: mongoose.Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    isEmailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Notifications expire after 30 days
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
