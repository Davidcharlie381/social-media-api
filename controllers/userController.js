const User = require("../models/userModel");
const { successResponse, errorResponse } = require("../utils/response");

const catchAsyncError = require("../utils/catchAsyncError");

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await User.find();

      successResponse(res, 200, "All users", users);
    } catch (error) {
      console.log(error);
      errorResponse(res, 500, "Failed to get users", err.stack);
    }
  }

  static getSingleUser = catchAsyncError(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password -_id -__v");

    if (!user) {
      return errorResponse(res, 404, "No user found");
    }

    successResponse(res, 200, "User found", user);
  });

  static followUser = catchAsyncError(async (req, res) => {
    const { username } = req.params;

    const userToFollow = await User.findOne({ username }).select(
      "-password -__v"
    );

    if (userToFollow.followers.includes(req.user._id)) {
      console.log("Already following");
      const followerIndex = userToFollow.followers.findIndex(
        (follower) => follower.toString() === req.user._id.toString()
      );
      userToFollow.followers.splice(followerIndex, 1);
      const followingIndex = req.user.following.findIndex(
        (following) => following.toString() === req.user._id.toString()
      );
      req.user.following.splice(followingIndex, 1);
    } else {
      console.log("Not following");
      userToFollow.followers.unshift(req.user._id);
      req.user.following.unshift(userToFollow._id);
    }

    await userToFollow.save();
    await req.user.save();

    successResponse(res, 201, `Followed ${username}`, userToFollow);
  });

  static updateUser = catchAsyncError(async (req, res) => {
    const { username, password } = req.body;

    if (!(username && password)) {
      return errorResponse(res, 400, "All fields required");
    }

    successResponse(res, 200, "Updated successfully", { username, password });
  });
}

module.exports = UserController;
