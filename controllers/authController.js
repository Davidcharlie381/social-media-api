const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const catchAsyncError = require("../utils/catchAsyncError");
const { successResponse, errorResponse } = require("../utils/response");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

class AuthController {
  static register = catchAsyncError(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email && password && username)) {
      return errorResponse(res, 401, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      // firstName,
      // lastName,
    });

    try {
      const verifyToken = crypto.randomBytes(32).toString("hex");

      const mailOptions = {
        to: email,
        subject: `Welcome to Soci, ${username}!`,
        text: `Hi, ${username}! \n\n Click on this link to verify your account: http://localhost:5000/api/v1/auth/verify?token=${verifyToken}`,
      };

      const result = await sendEmail(mailOptions);
      console.log(result);

      newUser.verificationToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

      await newUser.save();
      console.log("Reached");
    } catch (error) {
      newUser.verificationToken = undefined;
      await newUser.save();
      console.log("Didn't go");
    }

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

  static verify = catchAsyncError(async (req, res) => {
    const { token } = req.query;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ verificationToken: hashedToken });
    if (!user) {
      return errorResponse(
        res,
        401,
        "Unauthorized - Invalid or expired ronn dverification token"
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save({ validateBeforeSave: false });
    successResponse(res, 200, "Verified successfully");
  });

  // static resetPassword = catchAsyncError(async (req, res) => {
  //   successResponse(res, 200, "All good")
  // });
}

module.exports = AuthController;
