const UserController = require("../controllers/userController");
const { AuthMiddleware } = require("../middlewares/auth");

const userRouter = require("express").Router();

// @route GET /api/users
// @desc Get all users
// @access Private - Admin only

userRouter.get("/", AuthMiddleware.isAdmin, UserController.getUsers);

// @route GET /api/users/:username
// @desc Get a single user
// @access Private

userRouter.get(
  "/:username",
  AuthMiddleware.isAuth,
  UserController.getSingleUser
);

// @route POST /api/users/:username/follow
// @desc Follow/Unfollow a user
// @access Private

userRouter.post(
  "/:username/follow",
  AuthMiddleware.isAuth,
  UserController.followUser
);

// @route GET /api/users/:username/edit
// @desc Update user details
// @access Private

userRouter.put(
  "/:username/edit",
  AuthMiddleware.isAuth,
  UserController.updateUser
);

module.exports = userRouter;
