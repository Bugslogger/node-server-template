const express = require("express");
const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const clc = require("cli-color");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");

const {
  SERVER_NAME,
  COOKIE_SECRET,
  HTTP_ONLY,
  BODY_SIZE,
  BODY_PARAMETER_SIZE,
  RATE_LIMIT,
  RATE_LIMIT_TIME,
} = require("./config/server.config");

const app = express();

// create MAP object
const map = new Map();
express.serverStorage = map;

// Allow Cross-Origin requests
app.use(cors({ origin: "*", credentials: true }));

// cookies parser
app.use(cookieParser());

// Middleware for handling file uploads in memory
app.use(fileUpload());

// req body parser
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: BODY_SIZE,
    extended: true,
    parameterLimit: BODY_PARAMETER_SIZE,
  })
);

// parse application/json
app.use(bodyParser.json({ limit: BODY_SIZE }));

app.use(
  cookieSession({
    name: SERVER_NAME,
    keys: [COOKIE_SECRET], // should use as secret environment variable
    httpOnly: HTTP_ONLY,
    sameSite: "strict",
  })
);

// set view folder as root for html files
app.set("views", __dirname + "/view/html");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

// Limit request from the same API
const limiter = rateLimit({
  max: RATE_LIMIT,
  windowMs: RATE_LIMIT_TIME,
  message: "Too Many Request from this IP, please try again in an hour",
});

console.log(clc.blue("> rate limit: ", RATE_LIMIT));
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json());
console.log(clc.blue("> body size: ", BODY_SIZE));

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());
console.log(clc.blue("> xss: ", "true"));

// Prevent parameter pollution
app.use(hpp());
console.log(clc.blue("> parameter pollution: ", "true"));

app.use(logger("dev")); // log

module.exports = app;
