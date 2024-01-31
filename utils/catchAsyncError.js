// const catchAsyncError = fn => {
//   return Promise.resolve(fn(req, res, next)).catch(next);
// };

// OR

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsyncError;
