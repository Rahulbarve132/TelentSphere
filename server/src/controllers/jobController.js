const { Job, Profile } = require('../models');
const { AppError, catchAsync } = require('../utils');

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Private (Client/Recruiter)
 */
const createJob = catchAsync(async (req, res, next) => {
  const jobData = {
    ...req.body,
    postedBy: req.user._id,
  };

  const job = await Job.create(jobData);

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: { job },
  });
});

/**
 * @desc    Get all jobs
 * @route   GET /api/jobs
 * @access  Public
 */
const getAllJobs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status = 'open' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = {
    status,
    expiresAt: { $gt: new Date() },
    visibility: 'public',
  };

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate('postedBy', 'email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  // Get posters' profiles
  const posterIds = [...new Set(jobs.map(j => j.postedBy._id.toString()))];
  const profiles = await Profile.find({ user: { $in: posterIds } });
  const profileMap = profiles.reduce((acc, p) => {
    acc[p.user.toString()] = p;
    return acc;
  }, {});

  const jobsWithProfiles = jobs.map(job => {
    const jobObj = job.toObject();
    jobObj.posterProfile = profileMap[job.postedBy._id.toString()] || null;
    return jobObj;
  });

  res.status(200).json({
    success: true,
    data: {
      jobs: jobsWithProfiles,
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
 * @desc    Get job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'email');

  if (!job) {
    return next(AppError.notFound('Job not found'));
  }

  // Increment view count
  job.viewsCount += 1;
  await job.save({ validateBeforeSave: false });

  // Get poster's profile
  const profile = await Profile.findOne({ user: job.postedBy._id });

  res.status(200).json({
    success: true,
    data: {
      job,
      posterProfile: profile,
    },
  });
});

/**
 * @desc    Update job
 * @route   PUT /api/jobs/:id
 * @access  Private (Owner/Admin)
 */
const updateJob = catchAsync(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(AppError.notFound('Job not found'));
  }

  // Check ownership
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(AppError.forbidden('You can only update your own jobs'));
  }

  // Prevent changing postedBy
  delete req.body.postedBy;

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: { job },
  });
});

/**
 * @desc    Delete job
 * @route   DELETE /api/jobs/:id
 * @access  Private (Owner/Admin)
 */
const deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(AppError.notFound('Job not found'));
  }

  // Check ownership
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(AppError.forbidden('You can only delete your own jobs'));
  }

  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

/**
 * @desc    Search jobs
 * @route   GET /api/jobs/search
 * @access  Public
 */
const searchJobs = catchAsync(async (req, res, next) => {
  const {
    keyword,
    category,
    type,
    experienceLevel,
    locationType,
    minBudget,
    maxBudget,
    skills,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const query = {
    status: 'open',
    expiresAt: { $gt: new Date() },
    visibility: 'public',
  };

  // Text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Filters
  if (category) query.category = category;
  if (type) query.type = type;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (locationType) query['location.type'] = locationType;

  // Budget range
  if (minBudget || maxBudget) {
    query['budget.min'] = {};
    if (minBudget) query['budget.min'].$gte = parseInt(minBudget);
    if (maxBudget) query['budget.max'] = { $lte: parseInt(maxBudget) };
  }

  // Skills filter
  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim());
    query.skillsRequired = { $in: skillsArray };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate('postedBy', 'email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort),
    Job.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      jobs,
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
 * @desc    Get my posted jobs
 * @route   GET /api/jobs/my-jobs
 * @access  Private
 */
const getMyJobs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { postedBy: req.user._id };
  if (status) query.status = status;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      jobs,
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
 * @desc    Get featured jobs
 * @route   GET /api/jobs/featured
 * @access  Public
 */
const getFeaturedJobs = catchAsync(async (req, res, next) => {
  const { limit = 6 } = req.query;

  const jobs = await Job.find({
    status: 'open',
    isFeatured: true,
    expiresAt: { $gt: new Date() },
    visibility: 'public',
  })
    .populate('postedBy', 'email')
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { jobs },
  });
});

/**
 * @desc    Get job categories with counts
 * @route   GET /api/jobs/categories
 * @access  Public
 */
const getJobCategories = catchAsync(async (req, res, next) => {
  const categories = await Job.aggregate([
    {
      $match: {
        status: 'open',
        expiresAt: { $gt: new Date() },
        visibility: 'public',
      },
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  getMyJobs,
  getFeaturedJobs,
  getJobCategories,
};
