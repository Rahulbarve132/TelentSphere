const express = require('express');
const router = express.Router();
const { jobController } = require('../controllers');
const { authenticate, authorize, optionalAuth, validate } = require('../middleware');
const { createJobSchema, updateJobSchema, searchJobSchema } = require('../validations');

// Public routes
router.get('/search', validate(searchJobSchema, 'query'), jobController.searchJobs);
router.get('/featured', jobController.getFeaturedJobs);
router.get('/categories', jobController.getJobCategories);
router.get('/', optionalAuth, jobController.getAllJobs);
router.get('/:id', optionalAuth, jobController.getJobById);

// Protected routes
router.use(authenticate);
router.get('/user/my-jobs', jobController.getMyJobs);
router.post('/', authorize('client', 'recruiter', 'admin'), validate(createJobSchema), jobController.createJob);
router.put('/:id', validate(updateJobSchema), jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
