const express = require('express');
const router = express.Router();
const { companyController } = require('../controllers');
const { authenticate, authorize, validate, uploadLogo } = require('../middleware');
const {
  onboardCompanySchema,
  updateCompanySchema,
  updateVerificationStatusSchema,
} = require('../validations');

// All routes require authentication
router.use(authenticate);

// ──────────────────────────────────────────────────────────────────────────────
// Self-service routes  (recruiter / client / admin)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/company/onboard
 * Onboard a new company for the authenticated user.
 * Response includes `companyId` (the auto-generated _id of the company sub-doc).
 */
router.post(
  '/onboard',
  authorize('recruiter', 'client', 'admin'),
  validate(onboardCompanySchema),
  companyController.onboardCompany
);

/**
 * GET /api/company/me
 * Get the authenticated user's company.  Response includes `companyId`.
 */
router.get('/me', companyController.getMyCompany);

/**
 * PUT /api/company/me
 * Update the authenticated user's company details.
 */
router.put(
  '/me',
  authorize('recruiter', 'client', 'admin'),
  validate(updateCompanySchema),
  companyController.updateMyCompany
);

/**
 * POST /api/company/me/logo
 * Upload company logo (multipart/form-data, field name: "logo")
 */
router.post(
  '/me/logo',
  authorize('recruiter', 'client', 'admin'),
  uploadLogo,
  companyController.uploadCompanyLogo
);

/**
 * DELETE /api/company/me/logo
 * Delete company logo
 */
router.delete(
  '/me/logo',
  authorize('recruiter', 'client', 'admin'),
  companyController.deleteCompanyLogo
);

// ──────────────────────────────────────────────────────────────────────────────
// Admin — lookup by companyId  (company sub-document _id)
// These routes MUST be declared before /:profileId to avoid conflicts.
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/company/id/:companyId
 * Get a single company directly by its companyId.
 */
router.get(
  '/id/:companyId',
  authorize('admin'),
  companyController.getCompanyByCompanyId
);

/**
 * PATCH /api/company/id/:companyId/verify
 * Update verification status by companyId.
 */
router.patch(
  '/id/:companyId/verify',
  authorize('admin'),
  validate(updateVerificationStatusSchema),
  companyController.updateVerificationStatusByCompanyId
);

/**
 * DELETE /api/company/id/:companyId
 * Remove company data by companyId.
 */
router.delete(
  '/id/:companyId',
  authorize('admin'),
  companyController.deleteCompanyByCompanyId
);

// ──────────────────────────────────────────────────────────────────────────────
// Admin — lookup by profileId  (Profile document _id)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/company
 * List all companies (filters: verificationStatus, industry, size, search, page, limit).
 * Each item includes `companyId` and `profileId`.
 */
router.get('/', authorize('admin'), companyController.getAllCompanies);

/**
 * GET /api/company/:profileId
 * Get a single company by profile ID.
 */
router.get('/:profileId', authorize('admin'), companyController.getCompanyById);

/**
 * PATCH /api/company/:profileId/verify
 * Update verification status by profileId.
 */
router.patch(
  '/:profileId/verify',
  authorize('admin'),
  validate(updateVerificationStatusSchema),
  companyController.updateVerificationStatus
);

/**
 * DELETE /api/company/:profileId
 * Remove company data from a profile.
 */
router.delete('/:profileId', authorize('admin'), companyController.deleteCompany);

module.exports = router;
