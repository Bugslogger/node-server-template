const jwt = require("jsonwebtoken");
const transporter = require("./nodemailer");

/**
 *
 * @param {string} id
 * @param {string} role
 * @returns
 *
 * create jwt token
 *
 */
exports.createToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * server storage for generating and storing otp
 *
 * @param {object} param.storage
 * @param {string} param.uniqueId
 * @param {string} param.action
 * @returns {object}
 */
exports.serverStorage = ({ storage, uniqueId, action }) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6-digit OTP value
  if (action === "delete") {
    if (storage.has(uniqueId)) {
      storage.delete(uniqueId);

      return { deleted: true, storage, uniqueId };
    } else {
      return { storage, uniqueId, message: "uniqueId does not exists." };
    }
  } else {
    if (!!storage) {
      if (!uniqueId) {
        throw new Error("User uniqueId is not empty or undefined.");
      }
      if (storage.has(uniqueId)) {
        storage.delete(uniqueId);
      }
      storage.set(uniqueId, otp);
      return { otp, storage, uniqueId };
    } else {
      throw new Error("Server storge is undefined.");
    }
  }
};

exports.checkUserPasswordForgetLink = ({ storage, uniqueId, action }) => {
  try {
    if (!!storage) {
      if (!uniqueId) {
        throw new Error("User uniqueId is not empty or undefined.");
      }
      if (action === "delete") {
        if (storage.has(uniqueId)) {
          storage.delete(uniqueId);

          return { deleted: true, storage, uniqueId };
        } else {
          return { storage, uniqueId, message: "uniqueId does not exists." };
        }
      }

      if (storage.has(uniqueId)) {
        storage.delete(uniqueId);
      }

      storage.set(`f${uniqueId}p`, `requested password reset`);
      return { storage, uniqueId: `f${uniqueId}p` };
    } else {
      return { isError: true, error: "Server storge is undefined." };
      // throw new Error("Server storge is undefined.");
    }
  } catch (error) {
    return { isError: true, error };
  }
};

exports.sendMail = async (req, res, next, html, subject, message) => {
  const { email } = req.body;

  if (!email) {
    badRequest(res, "request body is missing one or more parameter");
  }

  if (!User.email.validate(email)) {
    Success(res, {
      statuscode: 0,
      message: "Invalid email address.",
    });
  }

  const mailData = {
    from: "No-Reply@zeal.biz",
    to: email,
    subject,
    html,
  };

  try {
    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        next(error);
        return console.log("error: ", error);
      }

      Success(res, {
        statuscode: 1,
        message,
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded && decoded?.id) {
        return {
          userId: decoded?.id,
        };
      }
      return err;
    });
  } catch (error) {
    return error;
  }
};
