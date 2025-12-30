const Joi = require('joi');

/**
 * Apply for job validation schema
 */
const applyJobSchema = Joi.object({
  jobId: Joi.string().required().messages({
    'any.required': 'Job ID is required',
  }),
  coverLetter: Joi.string().max(5000).allow('').messages({
    'string.max': 'Cover letter cannot exceed 5000 characters',
  }),
  proposedRate: Joi.object({
    amount: Joi.number().min(0),
    type: Joi.string().valid('hourly', 'fixed', 'monthly'),
    currency: Joi.string().max(3).default('USD'),
  }),
  availability: Joi.object({
    startDate: Joi.date().min('now'),
    hoursPerWeek: Joi.number().min(1).max(168),
  }),
  answers: Joi.array().items(
    Joi.object({
      question: Joi.string().max(500),
      answer: Joi.string().max(2000),
    })
  ).max(20),
});

/**
 * Update application status validation schema (for job poster)
 */
const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected')
    .required()
    .messages({
      'any.only': 'Invalid application status',
      'any.required': 'Status is required',
    }),
  note: Joi.string().max(1000).allow(''),
});

/**
 * Rate application validation schema
 */
const rateApplicationSchema = Joi.object({
  score: Joi.number().min(1).max(5).required().messages({
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating score is required',
  }),
  feedback: Joi.string().max(1000).allow(''),
});

/**
 * Add notes to application validation schema
 */
const addNotesSchema = Joi.object({
  notes: Joi.string().max(2000).required().messages({
    'any.required': 'Notes are required',
  }),
});

module.exports = {
  applyJobSchema,
  updateApplicationStatusSchema,
  rateApplicationSchema,
  addNotesSchema,
};
