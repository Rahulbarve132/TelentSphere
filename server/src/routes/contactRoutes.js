const express = require('express');
const router = express.Router();
const { contactController } = require('../controllers');
const { authenticate, authorize, validate } = require('../middleware');
const { submitContactSchema, updateContactSchema } = require('../validations');

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * POST /api/contact
 * Submit a contact us form — no authentication required.
 */
router.post(
  '/',
  validate(submitContactSchema),
  contactController.submitContact
);

// ─── Admin only — everything below requires authentication + admin role ───────
router.use(authenticate, authorize('admin'));

/**
 * GET /api/contact
 * List all contact submissions.
 * Query: page, limit, status, search, startDate, endDate
 */
router.get('/', contactController.getAllContacts);

/**
 * GET /api/contact/:id
 * Get a single contact submission (auto-marks as read).
 */
router.get('/:id', contactController.getContactById);

/**
 * PATCH /api/contact/:id
 * Update status (unread | read | resolved) or add admin notes.
 */
router.patch('/:id', validate(updateContactSchema), contactController.updateContact);

/**
 * DELETE /api/contact/:id
 * Delete a contact submission.
 */
router.delete('/:id', contactController.deleteContact);

module.exports = router;
