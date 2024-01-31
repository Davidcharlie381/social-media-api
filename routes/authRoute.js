const AuthController = require("../controllers/authController");

const authRouter = require("express").Router();

// @route /api/auth/v1/register
// @method POST
// @access public

authRouter.post("/register", AuthController.register);

// @route /api/auth/v1/login
// @method POST
// @access public

authRouter.post("/login", AuthController.login);

module.exports = authRouter;
