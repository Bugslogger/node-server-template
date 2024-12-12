const db = require("../models/db.connect");
const User = db.user;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    console.log("====================================");
    console.log("Is user: ", user);
    console.log("====================================");

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const verify = { checkDuplicateEmail };

module.exports = verify;
