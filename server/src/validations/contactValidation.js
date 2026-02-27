const Joi = require('joi');

/**
 * Contact form submission validation
 */
const submitContactSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).trim().required().messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(1).max(50).trim().required().messages({
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email':  'Please provide a valid email address',
      'any.required':  'Email address is required',
    }),
  message: Joi.string().min(10).max(2000).trim().required().messages({
    'string.min':    'Message must be at least 10 characters',
    'string.empty':  'Message is required',
    'any.required':  'Message is required',
  }),
});

/**
 * Admin: update status / notes on a contact submission
 */
const updateContactSchema = Joi.object({
  status: Joi.string().valid('unread', 'read', 'resolved'),
  adminNotes: Joi.string().max(1000).allow('', null),
}).min(1); // at least one field required

module.exports = {
  submitContactSchema,
  updateContactSchema,
};
