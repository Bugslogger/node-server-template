const SERVER_NAME = "fire-alarm";
const COOKIE_SECRET = "";
const HTTP_ONLY = true;
const BODY_SIZE = "30mb";
const BODY_PARAMETER_SIZE = 15;
const RATE_LIMIT = 1500;
const RATE_LIMIT_TIME = 60 * 60 * 1000;
const DATABASE_NAME = "postgres";

module.exports = {
  SERVER_NAME,
  BODY_SIZE,
  RATE_LIMIT_TIME,
  RATE_LIMIT,
  BODY_PARAMETER_SIZE,
  HTTP_ONLY,
  COOKIE_SECRET,
  DATABASE_NAME,
};