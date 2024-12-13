const nodemailer = require("nodemailer");
// const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  port: process.env.MAIL_PORT,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: process.env.MAIL_SECURE,
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// transporter.use(
//   "compile",
//   hbs({
//     viewPath: "view/email-templates",
//     extName: ".hbs",
//   })
// );

module.exports = transporter;
