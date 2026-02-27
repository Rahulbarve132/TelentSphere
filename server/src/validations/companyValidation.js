const Joi = require('joi');

const VALID_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+', '1', '2-10', '501-1000', '1000+'];
const VALID_VERIFICATION_METHODS = ['website', 'social_media', 'document', 'none'];
const VALID_VERIFICATION_STATUSES = ['pending', 'verified', 'rejected', 'unverified'];

/**
 * Social media sub-schema
 */
const verifiedSocialMediaSchema = Joi.object({
  platform: Joi.string().max(50).required(),
  url: Joi.string().uri().required(),
  followers: Joi.number().integer().min(0),
});

/**
 * Company onboarding validation schema — all core fields required
 */
const onboardCompanySchema = Joi.object({
  name: Joi.string().min(2).max(200).trim().required(),
  website: Joi.string().uri().required(),
  size: Joi.string()
    .valid(...VALID_SIZES)
    .required(),
  industry: Joi.string().max(100).trim().required(),
  description: Joi.string().max(2000).required(),
  city: Joi.string().max(100).trim().required(),
  isIndependentPractitioner: Joi.boolean().required(),
  contactEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  verificationMethod: Joi.string()
    .valid(...VALID_VERIFICATION_METHODS)
    .required(),
  verifiedWebsite: Joi.when('verificationMethod', {
    is: 'website',
    then: Joi.string().uri().required(),
    otherwise: Joi.string().uri().allow('', null),
  }),
  verifiedSocialMedia: Joi.when('verificationMethod', {
    is: 'social_media',
    then: verifiedSocialMediaSchema.required(),
    otherwise: Joi.object().allow(null),
  }),
});

/**
 * Company update validation schema — all fields optional for partial updates
 */
const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(200).trim(),
  website: Joi.string().uri().allow('', null),
  size: Joi.string()
    .valid(...VALID_SIZES)
    .allow(null, ''),
  industry: Joi.string().max(100).trim().allow('', null),
  description: Joi.string().max(2000).allow('', null),
  city: Joi.string().max(100).trim().allow('', null),
  isIndependentPractitioner: Joi.boolean(),
  contactEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .allow('', null),
  verificationMethod: Joi.string().valid(...VALID_VERIFICATION_METHODS),
  verifiedWebsite: Joi.string().uri().allow('', null),
  verifiedSocialMedia: verifiedSocialMediaSchema.allow(null),
});

/**
 * Admin verification status update schema
 */
const updateVerificationStatusSchema = Joi.object({
  verificationStatus: Joi.string()
    .valid(...VALID_VERIFICATION_STATUSES)
    .required(),
});

module.exports = {
  onboardCompanySchema,
  updateCompanySchema,
  updateVerificationStatusSchema,
};
