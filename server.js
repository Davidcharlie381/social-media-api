const express = require("express");
const cors = require("cors");
const winston = require("winston");

const connectDb = require("./utils/connectDb");
const config = require("./config/config");
const sendEmail = require("./utils/sendEmail");

const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const { errorResponse } = require("./utils/response");

const API_VERSION = "/api/v1";

const app = express();

// const mailOptions = {
//   from: "charleswisdomdavid@gmail.com",
//   to: "davidcharleswisdom@gmail.com",
//   subject: "Charlie from Soci",
//   text: "This is a plain text version of the email. You can view it if HTML is not supported.",
//   html: '<p>This is a <strong>bold</strong> and <em>italic</em> HTML email. You can view it in HTML-supported clients.</p><p>Here is a <a style="padding: 10px; background: red; color: white;" href="https://example.com">link</a>.</p><button>Click the button</button>',
// };

// function sendEmail() {
//   return new Promise((res, rej) => {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return rej(error.message);
//       }
//       return res(info);
//     });
//   });
// }

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.send("<h1>Welcome to Social Media API</h1>");
});

app.get("/mail", async (req, res) => {
  const result = await sendEmail();
  console.log(result);
  res.send(result.response);
});

app.use(`${API_VERSION}/auth`, authRouter);
app.use(`${API_VERSION}/users`, userRouter);


app.use("*", (req, res, next) => {
  res.status(404).send("<h1>404 - Not Found</h1>");
});

app.use((err, req, res, next) => {
  winston.error(err.message);
  errorResponse(res, 500, err.message, err.stack);
  // res.status(500).send("Bad omo");
});

app.listen(config.PORT, async () => {
  await connectDb();
  console.log(`App up and running on port ${config.PORT}`);
});
