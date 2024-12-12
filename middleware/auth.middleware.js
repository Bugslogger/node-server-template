const db = require("../models/user.model");
const { verifyToken } = require("../utils/helpers/app.helper");
const { Unauthorized } = require("../utils/helpers/status.code");
const User = db.user;

exports.isTokenValid = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token && !token.startsWith("Bearer")) {
      return Unauthorized(res, "Missing auth token");
    }

    const status = await verifyToken(token);
    if (status && status["userId"]) {
      const user = await User.findByPk(status["userId"]);
      if (user) {
      }
      // validate the user id
    } else {
      return Unauthorized(res, "Invalid Auth token!");
    }
  } catch (error) {
    return error;
  }
};
