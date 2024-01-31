const successResponse = (res, status, message, data) => {
  if (data) {
    return res.status(status).json({ success: true, data, message});
  }
  return res.status(status).json({ success: true, message });
};

const errorResponse = (res, status, err, stack) => {
  return res.status(status).json({ success: false, error: err, stack });
};

module.exports = { successResponse, errorResponse };
