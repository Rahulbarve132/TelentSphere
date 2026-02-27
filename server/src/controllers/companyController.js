const fs = require('fs');
const path = require('path');
const { Profile } = require('../models');
const { AppError, catchAsync } = require('../utils');

// ─── Helper ───────────────────────────────────────────────────────────────────
/**
 * Formats a profile + company into a consistent response shape.
 * Surfaces `companyId` (= company._id) as a top-level key so clients
 * can reference companies directly without knowing the profileId.
 */
const formatCompany = (profile) => ({
  companyId: profile.company._id,
  profileId: profile._id,
  owner: {
    userId: profile.user?._id ?? profile.user,
    email:  profile.user?.email,
    role:   profile.user?.role,
    name:   `${profile.firstName} ${profile.lastName}`,
  },
  company: profile.company,
});

// ─── Self-service ─────────────────────────────────────────────────────────────

/**
 * @desc    Onboard / create company profile for authenticated recruiter or client
 * @route   POST /api/company/onboard
 * @access  Private (recruiter | client | admin)
 */
const onboardCompany = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  if (!['recruiter', 'client', 'admin'].includes(req.user.role)) {
    return next(AppError.forbidden('Only recruiters and clients can onboard a company'));
  }

  let profile = await Profile.findOne({ user: userId });

  if (!profile) {
    return next(
      AppError.notFound('Profile not found. Please create your profile before onboarding a company')
    );
  }

  if (profile.company && profile.company.name) {
    return next(AppError.badRequest('Company is already onboarded. Use the update endpoint instead'));
  }

  const {
    name,
    website,
    size,
    industry,
    description,
    city,
    isIndependentPractitioner,
    contactEmail,
    verificationMethod,
    verifiedWebsite,
    verifiedSocialMedia,
  } = req.body;

  profile.company = {
    name,
    website,
    size,
    industry,
    description,
    city,
    isIndependentPractitioner: isIndependentPractitioner || false,
    contactEmail,
    verificationStatus: 'pending',
    verificationMethod: verificationMethod || 'none',
    verifiedWebsite: verificationMethod === 'website' ? verifiedWebsite : undefined,
    verifiedSocialMedia: verificationMethod === 'social_media' ? verifiedSocialMedia : undefined,
    logo: null,
  };

  await profile.save();

  res.status(201).json({
    success: true,
    message: 'Company onboarded successfully. Verification is pending review.',
    data: {
      companyId: profile.company._id,
      company:   profile.company,
    },
  });
});

/**
 * @desc    Get company profile for the authenticated user
 * @route   GET /api/company/me
 * @access  Private
 */
const getMyCompany = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  if (!profile.company || !profile.company.name) {
    return next(AppError.notFound('No company found for this account'));
  }

  res.status(200).json({
    success: true,
    data: {
      companyId: profile.company._id,
      company:   profile.company,
    },
  });
});

/**
 * @desc    Update company onboarding details
 * @route   PUT /api/company/me
 * @access  Private (recruiter | client | admin)
 */
const updateMyCompany = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  if (!['recruiter', 'client', 'admin'].includes(req.user.role)) {
    return next(AppError.forbidden('Only recruiters and clients can update company info'));
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  if (!profile.company || !profile.company.name) {
    return next(AppError.badRequest('No company found. Please onboard a company first'));
  }

  const allowedFields = [
    'name',
    'website',
    'size',
    'industry',
    'description',
    'city',
    'isIndependentPractitioner',
    'contactEmail',
    'verificationMethod',
    'verifiedWebsite',
    'verifiedSocialMedia',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      profile.company[field] = req.body[field];
    }
  });

  // Reset verification status whenever the method changes
  if (req.body.verificationMethod !== undefined) {
    profile.company.verificationStatus = 'pending';
  }

  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Company information updated successfully',
    data: {
      companyId: profile.company._id,
      company:   profile.company,
    },
  });
});

/**
 * @desc    Upload company logo
 * @route   POST /api/company/me/logo
 * @access  Private (recruiter | client | admin)
 */
const uploadCompanyLogo = catchAsync(async (req, res, next) => {
  if (!['recruiter', 'client', 'admin'].includes(req.user.role)) {
    return next(AppError.forbidden('Only recruiters and clients can upload a company logo'));
  }

  if (!req.file) {
    return next(AppError.badRequest('Please upload an image file for the logo'));
  }

  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  if (!profile.company || !profile.company.name) {
    return next(AppError.badRequest('No company found. Please onboard a company first'));
  }

  // Delete old logo from disk if it exists
  if (profile.company.logo) {
    const oldPath = path.join(process.cwd(), profile.company.logo);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  profile.company.logo = `uploads/logos/${req.file.filename}`;
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Company logo uploaded successfully',
    data: {
      companyId: profile.company._id,
      logo:      profile.company.logo,
    },
  });
});

/**
 * @desc    Delete company logo
 * @route   DELETE /api/company/me/logo
 * @access  Private (recruiter | client | admin)
 */
const deleteCompanyLogo = catchAsync(async (req, res, next) => {
  if (!['recruiter', 'client', 'admin'].includes(req.user.role)) {
    return next(AppError.forbidden('Only recruiters and clients can delete the company logo'));
  }

  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    return next(AppError.notFound('Profile not found'));
  }

  if (!profile.company || !profile.company.name) {
    return next(AppError.badRequest('No company found'));
  }

  if (profile.company.logo) {
    const logoPath = path.join(process.cwd(), profile.company.logo);
    if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    profile.company.logo = null;
    await profile.save();
  }

  res.status(200).json({
    success: true,
    message: 'Company logo deleted successfully',
  });
});

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * @desc    Admin: Get all companies with optional filters
 * @route   GET /api/company
 * @access  Private/Admin
 */
const getAllCompanies = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    verificationStatus,
    industry,
    size,
    search,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const matchStage = { 'company.name': { $exists: true, $ne: null } };

  if (verificationStatus)  matchStage['company.verificationStatus'] = verificationStatus;
  if (industry)            matchStage['company.industry'] = { $regex: industry, $options: 'i' };
  if (size)                matchStage['company.size'] = size;
  if (search) {
    matchStage.$or = [
      { 'company.name':     { $regex: search, $options: 'i' } },
      { 'company.industry': { $regex: search, $options: 'i' } },
      { 'company.city':     { $regex: search, $options: 'i' } },
    ];
  }

  const [profiles, total] = await Promise.all([
    Profile.find(matchStage)
      .populate('user', 'email role isVerified isActive createdAt')
      .select('firstName lastName company user')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'company.name': 1 }),
    Profile.countDocuments(matchStage),
  ]);

  const companies = profiles.map(formatCompany);

  res.status(200).json({
    success: true,
    data: {
      companies,
      pagination: {
        page:  parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * @desc    Admin: Get a single company by its own companyId (company._id)
 * @route   GET /api/company/id/:companyId
 * @access  Private/Admin
 */
const getCompanyByCompanyId = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ 'company._id': req.params.companyId })
    .populate('user', 'email role isVerified isActive createdAt');

  if (!profile || !profile.company || !profile.company.name) {
    return next(AppError.notFound('Company not found'));
  }

  res.status(200).json({
    success: true,
    data: formatCompany(profile),
  });
});

/**
 * @desc    Admin: Get a single company by profile ID
 * @route   GET /api/company/:profileId
 * @access  Private/Admin
 */
const getCompanyById = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.profileId)
    .populate('user', 'email role isVerified isActive createdAt');

  if (!profile || !profile.company || !profile.company.name) {
    return next(AppError.notFound('Company not found'));
  }

  res.status(200).json({
    success: true,
    data: formatCompany(profile),
  });
});

/**
 * @desc    Admin: Update company verification status — by companyId
 * @route   PATCH /api/company/id/:companyId/verify
 * @access  Private/Admin
 */
const updateVerificationStatusByCompanyId = catchAsync(async (req, res, next) => {
  const { verificationStatus } = req.body;

  const profile = await Profile.findOne({ 'company._id': req.params.companyId });

  if (!profile || !profile.company || !profile.company.name) {
    return next(AppError.notFound('Company not found'));
  }

  profile.company.verificationStatus = verificationStatus;
  await profile.save();

  res.status(200).json({
    success: true,
    message: `Company verification status updated to "${verificationStatus}"`,
    data: {
      companyId: profile.company._id,
      company:   profile.company,
    },
  });
});

/**
 * @desc    Admin: Update company verification status — by profileId
 * @route   PATCH /api/company/:profileId/verify
 * @access  Private/Admin
 */
const updateVerificationStatus = catchAsync(async (req, res, next) => {
  const { verificationStatus } = req.body;

  const profile = await Profile.findById(req.params.profileId);

  if (!profile || !profile.company || !profile.company.name) {
    return next(AppError.notFound('Company not found'));
  }

  profile.company.verificationStatus = verificationStatus;
  await profile.save();

  res.status(200).json({
    success: true,
    message: `Company verification status updated to "${verificationStatus}"`,
    data: {
      companyId: profile.company._id,
      company:   profile.company,
    },
  });
});

/**
 * @desc    Admin: Delete a company by companyId (clears company data from profile)
 * @route   DELETE /api/company/id/:companyId
 * @access  Private/Admin
 */
const deleteCompanyByCompanyId = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ 'company._id': req.params.companyId });

  if (!profile || !profile.company || !profile.company.name) {
    return next(AppError.notFound('Company not found'));
  }

  if (profile.company.logo) {
    const logoPath = path.join(process.cwd(), profile.company.logo);
    if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
  }

  profile.company = undefined;
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Company removed successfully',
  });
});

/**
 * @desc    Admin: Delete a company by profileId
 * @route   DELETE /api/company/:profileId
 * @access  Private/Admin
 */
const deleteCompany = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.profileId);

  if (!profile || !profile.company || !profile.company.name) {
    return next(AppError.notFound('Company not found'));
  }

  if (profile.company.logo) {
    const logoPath = path.join(process.cwd(), profile.company.logo);
    if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
  }

  profile.company = undefined;
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Company removed successfully',
  });
});

module.exports = {
  onboardCompany,
  getMyCompany,
  updateMyCompany,
  uploadCompanyLogo,
  deleteCompanyLogo,
  // Admin — by profileId
  getAllCompanies,
  getCompanyById,
  updateVerificationStatus,
  deleteCompany,
  // Admin — by companyId
  getCompanyByCompanyId,
  updateVerificationStatusByCompanyId,
  deleteCompanyByCompanyId,
};
