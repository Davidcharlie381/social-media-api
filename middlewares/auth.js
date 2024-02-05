const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");
const config = require("../config/config");
const User = require("../models/userModel");
const catchAsyncError = require("../utils/catchAsyncError");

class AuthMiddleware {
  static isAuth = catchAsyncError(async (req, res, next) => {
    // try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (!decoded) {
      return errorResponse(res, 401, "Unauthorized - Invalid token provided");
    }

    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return errorResponse(res, 404, "No user found with token provided");
    }

    req.user = currentUser;

    next();
  });

  static isAdmin = catchAsyncError(async (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "Unauthorized - No token provide");
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded) {
      return errorResponse(res, 401, "Unauthorized - Invalid token provided");
    }

    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return errorResponse(res, 404, "No user found with token provided");
    }

    if (currentUser.email !== "admin@example.com") {
      return errorResponse(
        res,
        401,
        "Unauthorized - Only admins can view this resource"
      );
    }

    req.user = currentUser;

    next();
  });
}

module.exports = { AuthMiddleware };
