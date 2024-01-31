const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const generateToken = async (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

module.exports = generateToken;
