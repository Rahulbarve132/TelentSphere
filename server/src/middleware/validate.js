const { AppError } = require('../utils');

/**
 * Validation middleware factory using Joi
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(errorMessages, 400));
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

module.exports = validate;
