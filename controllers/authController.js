const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const catchAsyncError = require("../utils/catchAsyncError");
const { successResponse, errorResponse } = require("../utils/response");
const bcrypt = require("bcryptjs");

class AuthController {
  static register = catchAsyncError(async (req, res) => {
    const { email, username, password } = req.body;

    // ,  firstName, lastName  && firstName && lastName

    if (!(email && password && username)) {
      return errorResponse(res, 401, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      // firstName,
      // lastName,
    });

    const token = await generateToken(newUser._id);

    const safeUser = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      // firstName: newUser.firstName,
      // lastName: newUser.lastName,
      // fullName: newUser.fullName,
      // avatarUrl: newUser.avatarUrl,
      token: token,
    };

    successResponse(res, 201, "User registration successful", safeUser);
  });

  static login = catchAsyncError(async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
      errorResponse(res, 400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 404, "No account found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, 400, "Password is incorrect");
    }

    const token = await generateToken(user._id);

    const safeUser = {
      id: user._id,
      email: user.email,
      username: user.username,
      // firstName: user.firstName,
      // lastName: user.lastName,
      // fullName: user.fullName,
      // avatarUrl: user.avatarUrl,
      token: token,
    };

    successResponse(res, 201, "Log in successful", safeUser);
  });

  // static resetPassword = catchAsyncError(async (req, res) => {
  //   successResponse(res, 200, "All good")
  // });
}

module.exports = AuthController;
