const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { authenticate, authorize, validate, uploadAvatar } = require('../middleware');
const { updateProfileSchema, addExperienceSchema, addEducationSchema } = require('../validations');

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

// Profile routes
router.get('/:id/profile', userController.getProfile);
router.put('/:id/profile', validate(updateProfileSchema), userController.updateProfile);

// Experience routes
router.post('/:id/profile/experience', validate(addExperienceSchema), userController.addExperience);
router.delete('/:id/profile/experience/:expId', userController.deleteExperience);

// Education routes
router.post('/:id/profile/education', validate(addEducationSchema), userController.addEducation);
router.delete('/:id/profile/education/:eduId', userController.deleteEducation);

// Avatar routes
router.post('/:id/avatar', uploadAvatar, userController.uploadAvatar);
router.delete('/:id/avatar', userController.deleteAvatar);

module.exports = router;
