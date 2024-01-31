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

    // console.log(currentUser)

    req.user = currentUser;

    next();
    // // } catch (error) {
    //   console.log(error.message);
    //   errorResponse(res, 500, error.message);
    // }
  });
}

module.exports = { AuthMiddleware };
