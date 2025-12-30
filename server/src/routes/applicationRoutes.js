const express = require('express');
const router = express.Router();
const { applicationController } = require('../controllers');
const { authenticate, authorize, validate, uploadResume } = require('../middleware');
const { applyJobSchema, updateApplicationStatusSchema, rateApplicationSchema, addNotesSchema } = require('../validations');

// All routes require authentication
router.use(authenticate);

// Apply for job (with optional resume upload)
router.post('/', uploadResume, validate(applyJobSchema), applicationController.applyForJob);

// Get my applications
router.get('/my-applications', applicationController.getMyApplications);

// Get applications for a specific job (job owner only)
router.get('/job/:jobId', applicationController.getApplicationsForJob);

// Get single application
router.get('/:id', applicationController.getApplicationById);

// Update application status (job owner only)
router.put('/:id', validate(updateApplicationStatusSchema), applicationController.updateApplicationStatus);

// Withdraw application (applicant only)
router.delete('/:id', applicationController.withdrawApplication);

// Rate application (job owner only)
router.post('/:id/rate', validate(rateApplicationSchema), applicationController.rateApplication);

// Add notes to application (job owner only)
router.put('/:id/notes', validate(addNotesSchema), applicationController.addNotes);

module.exports = router;
