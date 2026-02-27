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
// Self-service routes (recruiter / client)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/company/onboard
 * Onboard a new company for the authenticated user
 */
router.post(
  '/onboard',
  authorize('recruiter', 'client', 'admin'),
  validate(onboardCompanySchema),
  companyController.onboardCompany
);

/**
 * GET /api/company/me
 * Get the authenticated user's company
 */
router.get('/me', companyController.getMyCompany);

/**
 * PUT /api/company/me
 * Update the authenticated user's company details
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
// Admin-only routes
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/company
 * Get all companies (with optional filters)
 * Query: page, limit, verificationStatus, industry, size, search
 */
router.get('/', authorize('admin'), companyController.getAllCompanies);

/**
 * GET /api/company/:profileId
 * Get a single company by profile ID
 */
router.get('/:profileId', authorize('admin'), companyController.getCompanyById);

/**
 * PATCH /api/company/:profileId/verify
 * Update a company's verification status
 */
router.patch(
  '/:profileId/verify',
  authorize('admin'),
  validate(updateVerificationStatusSchema),
  companyController.updateVerificationStatus
);

/**
 * DELETE /api/company/:profileId
 * Remove company data from a profile
 */
router.delete('/:profileId', authorize('admin'), companyController.deleteCompany);

module.exports = router;
