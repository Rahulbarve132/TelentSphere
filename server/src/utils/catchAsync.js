/**
 * Wrapper function to catch async errors in route handlers
 * Eliminates the need for try-catch blocks in every async function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
