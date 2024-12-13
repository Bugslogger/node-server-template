const { VERIFICATION_LINK_EXPIRY } = require("../config/server.config");
const db = require("../models/db.connect");
const {
  checkUserPasswordForgetLink,
  sendMail,
} = require("../utils/helpers/app.helper");
const { badRequest } = require("../utils/helpers/status.code");
const User = db.user;

const checkDuplicateEmail = async (req, res, next, serverStorage) => {
  try {
    if (!req.body.email) {
      return badRequest(res, "Missing email address");
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      if (user?.dataValues?.isVerified) {
        return res.status(400).send({
          message: "Failed! Email is already in use!",
        });
      } else {
        // after data has been inserted into table.
        // it will send email to the users email address for verifying the email address.
        const template = require("../view/email-templates/verifyUser")({
          email: user?.dataValues?.email,
          link: `${
            process.env.NODE_ENV === "development"
              ? process.env.DEV_BASE_URL
              : process.env.PROD_BASE_URL
          }/api/auth/verify-user?id=${user?.dataValues?.uid}`,
        });

        const message =
          "Email already exists we have sent an verification email to " +
          user?.dataValues?.email;
        /**
         * below function `checkUserPasswordForgetLink` stores users `uid` into server store.
         * just to verify that only this user has requested for the email verification and this request is not from any anonymous user.
         */
        checkUserPasswordForgetLink({
          storage: serverStorage,
          uniqueId: `verify${user?.dataValues?.uid}`,
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
        console.log(serverStorage);
        setTimeout(() => {
          const response = checkUserPasswordForgetLink({
            storage: serverStorage,
            uniqueId: `verify${user?.dataValues?.uid}`,
            action: "delete",
          });
          console.log(serverStorage, "Deleted", response);
        }, VERIFICATION_LINK_EXPIRY);
        sendMail(req, res, next, template, "Account Verification", message);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const verify = { checkDuplicateEmail };

module.exports = verify;
