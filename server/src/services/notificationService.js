const { Notification } = require('../models');

/**
 * Create a notification
 * @param {Object} data - Notification data
 */
const createNotification = async (data) => {
  const notification = await Notification.create(data);
  return notification;
};

/**
 * Create application received notification (for job poster)
 */
const notifyApplicationReceived = async (userId, applicantName, jobId, jobTitle, applicationId) => {
  return createNotification({
    user: userId,
    type: 'application_received',
    title: 'New Application Received',
    message: `${applicantName} has applied for your job posting: ${jobTitle}`,
    data: {
      jobId,
      applicationId,
      link: `/applications/${applicationId}`,
    },
    priority: 'high',
  });
};

/**
 * Create application status changed notification (for applicant)
 */
const notifyApplicationStatusChanged = async (userId, jobTitle, status, applicationId, jobId) => {
  const statusMessages = {
    reviewing: 'is being reviewed',
    shortlisted: 'has been shortlisted',
    interview: 'has been selected for an interview',
    accepted: 'has been accepted! Congratulations!',
    rejected: 'was not selected for this position',
  };

  return createNotification({
    user: userId,
    type: 'application_status_changed',
    title: 'Application Status Updated',
    message: `Your application for ${jobTitle} ${statusMessages[status] || 'has been updated'}`,
    data: {
      jobId,
      applicationId,
      link: `/my-applications/${applicationId}`,
      metadata: { status },
    },
    priority: status === 'accepted' || status === 'interview' ? 'high' : 'medium',
  });
};

/**
 * Create job posted notification (for followers or matched developers)
 */
const notifyJobPosted = async (userIds, jobId, jobTitle, companyName) => {
  const notifications = userIds.map((userId) => ({
    user: userId,
    type: 'job_posted',
    title: 'New Job Matching Your Skills',
    message: `${companyName} has posted a new job: ${jobTitle}`,
    data: {
      jobId,
      link: `/jobs/${jobId}`,
    },
    priority: 'medium',
  }));

  return Notification.insertMany(notifications);
};

/**
 * Create account verified notification
 */
const notifyAccountVerified = async (userId) => {
  return createNotification({
    user: userId,
    type: 'account_verified',
    title: 'Account Verified',
    message: 'Your email has been verified successfully. You now have full access to TalentSphere.',
    data: {
      link: '/profile',
    },
    priority: 'high',
  });
};

/**
 * Create welcome notification
 */
const notifyWelcome = async (userId, userName) => {
  return createNotification({
    user: userId,
    type: 'welcome',
    title: 'Welcome to TalentSphere!',
    message: `Hi ${userName}! Welcome to TalentSphere. Complete your profile to get started.`,
    data: {
      link: '/profile',
    },
    priority: 'medium',
  });
};

/**
 * Create job expired notification (for job poster)
 */
const notifyJobExpired = async (userId, jobId, jobTitle) => {
  return createNotification({
    user: userId,
    type: 'job_expired',
    title: 'Job Posting Expired',
    message: `Your job posting "${jobTitle}" has expired. Renew it to keep receiving applications.`,
    data: {
      jobId,
      link: `/jobs/${jobId}/edit`,
    },
    priority: 'medium',
  });
};

/**
 * Create broadcast notification (admin)
 */
const broadcastNotification = async (userIds, title, message, link, senderId) => {
  const notifications = userIds.map((userId) => ({
    user: userId,
    type: 'admin_broadcast',
    title,
    message,
    data: {
      link,
      fromUserId: senderId,
    },
    priority: 'high',
  }));

  return Notification.insertMany(notifications);
};

/**
 * Create system notification
 */
const notifySystem = async (userId, title, message, link) => {
  return createNotification({
    user: userId,
    type: 'system',
    title,
    message,
    data: { link },
    priority: 'low',
  });
};

module.exports = {
  createNotification,
  notifyApplicationReceived,
  notifyApplicationStatusChanged,
  notifyJobPosted,
  notifyAccountVerified,
  notifyWelcome,
  notifyJobExpired,
  broadcastNotification,
  notifySystem,
};
