const Joi = require('joi');

/**
 * Create job validation schema
 */
const createJobSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().trim().messages({
    'string.min': 'Job title must be at least 5 characters',
    'any.required': 'Job title is required',
  }),
  description: Joi.string().min(50).max(10000).required().messages({
    'string.min': 'Job description must be at least 50 characters',
    'any.required': 'Job description is required',
  }),
  type: Joi.string()
    .valid('full-time', 'part-time', 'contract', 'freelance', 'internship')
    .required()
    .messages({
      'any.only': 'Invalid job type',
      'any.required': 'Job type is required',
    }),
  category: Joi.string()
    .valid(
      'web-development',
      'mobile-development',
      'ui-ux-design',
      'data-science',
      'devops',
      'cloud-computing',
      'cybersecurity',
      'blockchain',
      'ai-ml',
      'game-development',
      'other'
    )
    .required()
    .messages({
      'any.only': 'Invalid job category',
      'any.required': 'Job category is required',
    }),
  skillsRequired: Joi.array().items(Joi.string().max(50)).max(20).default([]),
  experienceLevel: Joi.string()
    .valid('entry', 'mid', 'senior', 'lead', 'executive')
    .default('mid'),
  budget: Joi.object({
    type: Joi.string().valid('fixed', 'hourly', 'monthly').default('fixed'),
    min: Joi.number().min(0),
    max: Joi.number().min(Joi.ref('min')),
    currency: Joi.string().max(3).default('USD'),
  }),
  location: Joi.object({
    type: Joi.string().valid('remote', 'onsite', 'hybrid').default('remote'),
    city: Joi.string().max(100).allow(''),
    state: Joi.string().max(100).allow(''),
    country: Joi.string().max(100).allow(''),
  }),
  status: Joi.string()
    .valid('draft', 'open')
    .default('open'),
  visibility: Joi.string()
    .valid('public', 'private', 'invite-only')
    .default('public'),
  applicationDeadline: Joi.date().min('now').allow(null),
  expiresAt: Joi.date().min('now').allow(null),
  requirements: Joi.array().items(Joi.string().max(500)).max(20).default([]),
  benefits: Joi.array().items(Joi.string().max(500)).max(20).default([]),
});

/**
 * Update job validation schema
 */
const updateJobSchema = Joi.object({
  title: Joi.string().min(5).max(200).trim(),
  description: Joi.string().min(50).max(10000),
  type: Joi.string().valid('full-time', 'part-time', 'contract', 'freelance', 'internship'),
  category: Joi.string().valid(
    'web-development',
    'mobile-development',
    'ui-ux-design',
    'data-science',
    'devops',
    'cloud-computing',
    'cybersecurity',
    'blockchain',
    'ai-ml',
    'game-development',
    'other'
  ),
  skillsRequired: Joi.array().items(Joi.string().max(50)).max(20),
  experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'lead', 'executive'),
  budget: Joi.object({
    type: Joi.string().valid('fixed', 'hourly', 'monthly'),
    min: Joi.number().min(0),
    max: Joi.number().min(Joi.ref('min')),
    currency: Joi.string().max(3),
  }),
  location: Joi.object({
    type: Joi.string().valid('remote', 'onsite', 'hybrid'),
    city: Joi.string().max(100).allow(''),
    state: Joi.string().max(100).allow(''),
    country: Joi.string().max(100).allow(''),
  }),
  status: Joi.string().valid('draft', 'open', 'closed', 'paused', 'filled'),
  visibility: Joi.string().valid('public', 'private', 'invite-only'),
  applicationDeadline: Joi.date().allow(null),
  expiresAt: Joi.date().allow(null),
  requirements: Joi.array().items(Joi.string().max(500)).max(20),
  benefits: Joi.array().items(Joi.string().max(500)).max(20),
  isFeatured: Joi.boolean(),
});

/**
 * Job search query validation schema
 */
const searchJobSchema = Joi.object({
  keyword: Joi.string().max(200).allow(''),
  category: Joi.string().allow(''),
  type: Joi.string().allow(''),
  experienceLevel: Joi.string().allow(''),
  locationType: Joi.string().valid('remote', 'onsite', 'hybrid').allow(''),
  minBudget: Joi.number().min(0),
  maxBudget: Joi.number().min(Joi.ref('minBudget')),
  skills: Joi.string().allow(''), // Comma-separated skills
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid('createdAt', 'budget.max', 'applicationsCount').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createJobSchema,
  updateJobSchema,
  searchJobSchema,
};
