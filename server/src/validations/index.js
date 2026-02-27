const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('./authValidation');

const {
  updateProfileSchema,
  experienceSchema,
  educationSchema,
  addExperienceSchema,
  addEducationSchema,
} = require('./userValidation');

const {
  createJobSchema,
  updateJobSchema,
  searchJobSchema,
} = require('./jobValidation');

const {
  applyJobSchema,
  updateApplicationStatusSchema,
  rateApplicationSchema,
  addNotesSchema,
} = require('./applicationValidation');

const {
  onboardCompanySchema,
  updateCompanySchema,
  updateVerificationStatusSchema,
} = require('./companyValidation');

const {
  submitContactSchema,
  updateContactSchema,
} = require('./contactValidation');

module.exports = {
  // Auth
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  // User/Profile
  updateProfileSchema,
  experienceSchema,
  educationSchema,
  addExperienceSchema,
  addEducationSchema,
  // Job
  createJobSchema,
  updateJobSchema,
  searchJobSchema,
  // Application
  applyJobSchema,
  updateApplicationStatusSchema,
  rateApplicationSchema,
  addNotesSchema,
  // Company
  onboardCompanySchema,
  updateCompanySchema,
  updateVerificationStatusSchema,
  // Contact
  submitContactSchema,
  updateContactSchema,
};
