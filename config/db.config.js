const { DATABASE_NAME } = require("./server.config");

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: DATABASE_NAME,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: process.env.DB_TIMEZONE,
};

