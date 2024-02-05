const AuthController = require("../controllers/authController");

const authRouter = require("express").Router();

// @route POST /api/v1/auth/register
// @desc create a new user
// @access public

authRouter.post("/register", AuthController.register);

// @route POST /api/v1/auth/login
// @desc Log in user
// @access public

authRouter.post("/login", AuthController.login);

// @route GET /api/v1/auth/verify
// @desc Verify user
// @access private

authRouter.get("/verify", AuthController.verify);

module.exports = authRouter;
