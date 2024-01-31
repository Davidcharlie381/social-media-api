const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.MAILER_USER,
    pass: config.MAILER_PASS,
  },
});

async function sendEmail(options) {
  transporter.sendMail(options, (err, info) => {
    if (err) {
      return err.message;
    }
    return info.messageId;
  });
}

module.exports = sendEmail;
