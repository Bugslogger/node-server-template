const config = require("../config/db.config"); // import database config

const Sequelize = require("sequelize");

const connection = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: config.pool,
  timezone: config.timezone,
});

const db = {};
db.connection = connection;
db.Sequelize = Sequelize;

// models
db.user = require("./user.model")(connection, Sequelize);

module.exports = db;
