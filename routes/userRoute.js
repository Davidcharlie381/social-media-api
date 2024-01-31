const UserController = require("../controllers/userController");
const { AuthMiddleware } = require("../middlewares/auth");

const userRouter = require("express").Router();

// @route GET /api/users
// @desc Get all users
// @access Public

userRouter.get("/", UserController.getUsers);

// @route GET /api/users/:username
// @desc Get a single user
// @access Public for now ?

userRouter.get(
  "/:username",
  AuthMiddleware.isAuth,
  UserController.getSingleUser
);

userRouter.post(
  "/:username/follow",
  AuthMiddleware.isAuth,
  UserController.followUser
);

userRouter.post(
  "/:username/edit",
  AuthMiddleware.isAuth,
  UserController.updateUser
);

module.exports = userRouter;
