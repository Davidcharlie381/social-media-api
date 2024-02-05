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
  return new Promise((res, rej) => {
    transporter.sendMail(
      {
        from: "helendavid733@gmail.com",
        to: options.to,
        subject: options.subject,
        text: options.text,
      },
      (error, info) => {
        if (error) {
          return rej(error.message);
        }
        return res(info);
      }
    );
  });
}

module.exports = sendEmail;
