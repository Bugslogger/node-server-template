const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  Success,
  badRequest,
  notFound,
  internalError,
  Created,
} = require("../utils/helpers/status.code");
const {
  createToken,
  checkUserPasswordForgetLink,
  sendMail,
} = require("../utils/helpers/app.helper");
const { VERIFICATION_LINK_EXPIRY } = require("../config/server.config");

exports.login = async (req, res, next, app, db) => {
  const { email, password } = req.body;
  const User = db.user;

  if (!email) {
    return badRequest(res, "Missing email address from body.");
  }

  if (!password) {
    return badRequest(res, "Missing password from body.");
  }

  try {
    const isEmailExits = await User.findOne({ where: { email } });
    console.log("isEmailExits: ", isEmailExits?.dataValues);
    if (!isEmailExits) {
      return notFound(res, "User not found");
    }

    if (!isEmailExits?.dataValues?.isVerified) {
      return notFound(res, "User not found you can try creating a new account.");
    }

    const Password = isEmailExits?.dataValues?.password;
    const isValidPassword = bcrypt.compareSync(password, Password);

    if (isValidPassword) {
      Success(res, {
        statuscode: 1,
        token: createToken(isEmailExits?.dataValues?.id, "user"),
      });
    } else {
      return badRequest(res, "Invalid password");
    }
  } catch (error) {
    next();
  }
};

exports.create = async (req, res, next, serverStorage, db) => {
  const { email, password, username } = req.body;
  const User = db.user;

  if (!email) {
    return badRequest(res, "Missing email address from body.");
  }

  if (!password) {
    return badRequest(res, "Missing password from body.");
  }

  if (!username) {
    return badRequest(res, "Missing username from body.");
  }

  if (!serverStorage) {
    return internalError(res);
  }

  try {
    const uid = uuidv4();

    console.log("process.env.SALT", process.env.SALT);

    // generate hashpassword
    const hashPassword = bcrypt.hashSync(password, process.env.SALT);

    const createUser = await User.create({
      fullname: username,
      email,
      password: hashPassword,
      uid,
      role: "user",
    });

    if (!createUser || createUser == null) {
      return internalError(res, "Failed to create new user.");
    }

    // after data has been inserted into table.
    // it will send email to the users email address for verifying the email address.
    const template = require("../view/email-templates/verifyUser")({
      email,
      link: `${
        process.env.NODE_ENV === "development"
          ? process.env.DEV_BASE_URL
          : process.env.PROD_BASE_URL
      }/api/auth/verify-user?id=${uid}`,
    });

    const message = "We have sent an verification email to " + email;
    /**
     * below function `checkUserPasswordForgetLink` stores users `uid` into server store.
     * just to verify that only this user has requested for the email verification and this request is not from any anonymous user.
     */
    checkUserPasswordForgetLink({
      storage: serverStorage,
      uniqueId: `verify${uid}`,
    });

    // after `uid` of user is stored into server storage
    // it will send an email with verification link
    /**
     * below function sends email to the given email address.
     * below function `sendMail` accepyts 6 argumnets
     * 1. reuest (from express)
     * 2. response (from express)
     * 3. next (from express)
     * 4. email template which will be sent on email.
     * 5. subject of email
     * 6. message sent in the api response.
     */

    setTimeout(() => {
      const response = checkUserPasswordForgetLink({
        storage: serverStorage,
        uniqueId: `verify${uid}`,
        action: "delete",
      });
      console.log(serverStorage, "Deleted", response);
    }, VERIFICATION_LINK_EXPIRY);
    sendMail(req, res, next, template, "Account Verification", message);
  } catch (error) {
    internalError(res, error.message);
  }
};

exports.verifyUserWithEmail = async (req, res, next, serverStorage, db) => {
  try {
    const { id } = req.query;
    const User = db.user;

    console.log(serverStorage, User, id);
    console.log(serverStorage.has(`fverify${id}p`));

    if (serverStorage.has(`fverify${id}p`)) {
      const isUserExits = await User.findOne({ where: { uid: id } });
      console.log(isUserExits);

      if (isUserExits?.dataValues?.uid == id) {
        console.log(isUserExits);
        if (isUserExits?.dataValues?.isVerified) {
          res.render("verified.html");
        } else {
          const isUpdated = await User.update(
            { isVerified: true },
            { where: { uid: id } }
          );

          if (isUpdated) {
            res.render("success.html");
          } else {
            internalError(res);
          }
        }
      } else {
        res.render("error.html");
      }
      //   serverStorage.delete(`fverify${uniqueId}p`);
    } else {
      res.render("error.html");
    }
  } catch (error) {
    res.render("error.html");
  }
};
