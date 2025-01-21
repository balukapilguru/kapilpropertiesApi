const successResponse = (res, message, data = {}) => {
  res.status(200).json({ success: true, message, data });
};

const errorResponse = (res, message, statusCode = 400) => {
  res.status(statusCode).json({ success: false, message });
};

module.exports = { successResponse, errorResponse };
