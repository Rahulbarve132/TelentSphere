const fs = require('fs');
const path = require('path');
const { Application, Job, User, Profile } = require('../models');

const { AppError, catchAsync } = require('../utils');
const { emailService, notificationService } = require('../services');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private (Developer)
 */
const applyForJob = catchAsync(async (req, res, next) => {
  const { jobId, coverLetter, proposedRate, availability, answers } = req.body;

  // Check if job exists and is open
  const job = await Job.findById(jobId);
  if (!job) {
    return next(AppError.notFound('Job not found'));
  }

  if (job.status !== 'open') {
    return next(AppError.badRequest('This job is no longer accepting applications'));
  }

  if (job.expiresAt && new Date() > job.expiresAt) {
    return next(AppError.badRequest('This job has expired'));
  }

  // Check if user is trying to apply to their own job
  if (job.postedBy.toString() === req.user._id.toString()) {
    return next(AppError.badRequest('You cannot apply to your own job'));
  }

  // Check for duplicate application
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (existingApplication) {
    // Cleanup uploaded file if duplicate
    if (req.file) {
      const filePath = path.join(process.cwd(), req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return next(AppError.conflict('You have already applied for this job'));
  }


  // Create application
  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    coverLetter,
    proposedRate,
    availability,
    answers,
    resume: req.file ? `uploads/resumes/${req.file.filename}` : undefined,
  });

  // Get applicant's profile
  const applicantProfile = await Profile.findOne({ user: req.user._id });
  const applicantName = applicantProfile 
    ? `${applicantProfile.firstName} ${applicantProfile.lastName}` 
    : req.user.email;

  // Notify job poster
  const poster = await User.findById(job.postedBy);
  const posterProfile = await Profile.findOne({ user: job.postedBy });
  const posterName = posterProfile?.firstName || 'User';

  // Create notification for job poster
  await notificationService.notifyApplicationReceived(
    job.postedBy,
    applicantName,
    job._id,
    job.title,
    application._id
  );

  // Send email notification
  try {
    await emailService.sendNewApplicationEmail(
      poster.email,
      posterName,
      applicantName,
      job.title,
      application._id
    );
  } catch (error) {
    console.error('Error sending application email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { application },
  });
});

/**
 * @desc    Get applications for a job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Job Owner/Admin)
 */
const getApplicationsForJob = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  // Check if job exists and user is owner
  const job = await Job.findById(jobId);
  if (!job) {
    return next(AppError.notFound('Job not found'));
  }

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(AppError.forbidden('You can only view applications for your own jobs'));
  }

  const query = { job: jobId };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate('applicant', 'email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Application.countDocuments(query),
  ]);

  // Get applicants' profiles
  const applicantIds = applications.map(a => a.applicant._id);
  const profiles = await Profile.find({ user: { $in: applicantIds } });
  const profileMap = profiles.reduce((acc, p) => {
    acc[p.user.toString()] = p;
    return acc;
  }, {});

  const applicationsWithProfiles = applications.map(app => {
    const appObj = app.toObject();
    appObj.applicantProfile = profileMap[app.applicant._id.toString()] || null;
    return appObj;
  });

  res.status(200).json({
    success: true,
    data: {
      applications: applicationsWithProfiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * @desc    Get my applications
 * @route   GET /api/applications/my-applications
 * @access  Private
 */
const getMyApplications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { applicant: req.user._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate('job', 'title type category status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Application.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * @desc    Get application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
const getApplicationById = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id)
    .populate('job')
    .populate('applicant', 'email');

  if (!application) {
    return next(AppError.notFound('Application not found'));
  }

  // Check if user is applicant, job owner, or admin
  const job = await Job.findById(application.job._id);
  const isApplicant = application.applicant._id.toString() === req.user._id.toString();
  const isJobOwner = job.postedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isApplicant && !isJobOwner && !isAdmin) {
    return next(AppError.forbidden('You do not have permission to view this application'));
  }

  // Mark as viewed if job owner is viewing
  if (isJobOwner && !application.isViewed) {
    application.isViewed = true;
    application.viewedAt = new Date();
    await application.save();
  }

  // Get applicant profile
  const applicantProfile = await Profile.findOne({ user: application.applicant._id });

  res.status(200).json({
    success: true,
    data: {
      application,
      applicantProfile,
    },
  });
});

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id
 * @access  Private (Job Owner/Admin)
 */
const updateApplicationStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;

  const application = await Application.findById(req.params.id).populate('job');

  if (!application) {
    return next(AppError.notFound('Application not found'));
  }

  // Check if user is job owner or admin
  const job = await Job.findById(application.job._id);
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(AppError.forbidden('You can only update applications for your own jobs'));
  }

  // Update status
  const oldStatus = application.status;
  application.status = status;
  application.statusHistory.push({
    status,
    changedBy: req.user._id,
    note,
  });
  await application.save();

  // Notify applicant
  const applicant = await User.findById(application.applicant);
  const applicantProfile = await Profile.findOne({ user: application.applicant });
  const applicantName = applicantProfile?.firstName || 'User';

  await notificationService.notifyApplicationStatusChanged(
    application.applicant,
    job.title,
    status,
    application._id,
    job._id
  );

  // Send email notification
  try {
    await emailService.sendApplicationStatusEmail(
      applicant.email,
      applicantName,
      job.title,
      status,
      application._id
    );
  } catch (error) {
    console.error('Error sending status email:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    data: { application },
  });
});

/**
 * @desc    Withdraw application
 * @route   DELETE /api/applications/:id
 * @access  Private (Applicant)
 */
const withdrawApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(AppError.notFound('Application not found'));
  }

  // Check if user is the applicant
  if (application.applicant.toString() !== req.user._id.toString()) {
    return next(AppError.forbidden('You can only withdraw your own applications'));
  }

  // Check if application can be withdrawn
  if (['accepted', 'rejected'].includes(application.status)) {
    return next(AppError.badRequest('Cannot withdraw an application that has been processed'));
  }

  application.status = 'withdrawn';
  application.statusHistory.push({
    status: 'withdrawn',
    changedBy: req.user._id,
    note: 'Withdrawn by applicant',
  });
  await application.save();

  res.status(200).json({
    success: true,
    message: 'Application withdrawn successfully',
  });
});

/**
 * @desc    Rate application
 * @route   POST /api/applications/:id/rate
 * @access  Private (Job Owner)
 */
const rateApplication = catchAsync(async (req, res, next) => {
  const { score, feedback } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(AppError.notFound('Application not found'));
  }

  const job = await Job.findById(application.job);
  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(AppError.forbidden('You can only rate applications for your own jobs'));
  }

  application.rating = {
    score,
    feedback,
    ratedBy: req.user._id,
    ratedAt: new Date(),
  };
  await application.save();

  res.status(200).json({
    success: true,
    message: 'Application rated successfully',
    data: { application },
  });
});

/**
 * @desc    Add notes to application
 * @route   PUT /api/applications/:id/notes
 * @access  Private (Job Owner)
 */
const addNotes = catchAsync(async (req, res, next) => {
  const { notes } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(AppError.notFound('Application not found'));
  }

  const job = await Job.findById(application.job);
  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(AppError.forbidden('You can only add notes to applications for your own jobs'));
  }

  application.notes = notes;
  await application.save();

  res.status(200).json({
    success: true,
    message: 'Notes added successfully',
    data: { application },
  });
});

module.exports = {
  applyForJob,
  getApplicationsForJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  rateApplication,
  addNotes,
};
