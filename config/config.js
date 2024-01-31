require("dotenv").config();

const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  LOCAL_DB: "mongodb://127.0.0.1:27017/social-media-api",
  PORT: process.env.PORT || 3000,
  MAILER_USER: process.env.NODEMAILER_USER,
  MAILER_PASS: process.env.NODEMAILER_PASS,
  prod: process.env.NODE_ENV === "production",
};

module.exports = config;
