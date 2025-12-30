const Joi = require('joi');

/**
 * Profile update validation schema
 */
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).trim(),
  lastName: Joi.string().min(2).max(50).trim(),
  headline: Joi.string().max(200).allow(''),
  bio: Joi.string().max(2000).allow(''),
  phone: Joi.string().max(20).allow(''),
  website: Joi.string().uri().allow(''),
  location: Joi.object({
    city: Joi.string().max(100).allow(''),
    state: Joi.string().max(100).allow(''),
    country: Joi.string().max(100).allow(''),
  }),
  skills: Joi.array().items(Joi.string().max(50)).max(50),
  hourlyRate: Joi.number().min(0),
  availability: Joi.string().valid('available', 'busy', 'not-available'),
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().allow(''),
    github: Joi.string().uri().allow(''),
    twitter: Joi.string().uri().allow(''),
    portfolio: Joi.string().uri().allow(''),
  }),
  company: Joi.object({
    name: Joi.string().max(200).allow(''),
    website: Joi.string().uri().allow(''),
    size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+'),
    industry: Joi.string().max(100).allow(''),
  }),
});

/**
 * Experience validation schema
 */
const experienceSchema = Joi.object({
  title: Joi.string().max(100).required(),
  company: Joi.string().max(100).required(),
  location: Joi.string().max(100).allow(''),
  from: Joi.date().required(),
  to: Joi.date().allow(null),
  current: Joi.boolean().default(false),
  description: Joi.string().max(2000).allow(''),
});

/**
 * Education validation schema
 */
const educationSchema = Joi.object({
  school: Joi.string().max(100).required(),
  degree: Joi.string().max(100).required(),
  fieldOfStudy: Joi.string().max(100).allow(''),
  from: Joi.date().required(),
  to: Joi.date().allow(null),
  current: Joi.boolean().default(false),
  description: Joi.string().max(2000).allow(''),
});

/**
 * Add experience validation schema
 */
const addExperienceSchema = Joi.object({
  experience: experienceSchema.required(),
});

/**
 * Add education validation schema
 */
const addEducationSchema = Joi.object({
  education: educationSchema.required(),
});

module.exports = {
  updateProfileSchema,
  experienceSchema,
  educationSchema,
  addExperienceSchema,
  addEducationSchema,
};
