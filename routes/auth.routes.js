const express = require("express");
const router = express.Router();
const db = require("../models/db.connect");

// auth controller
const authcontroller = require("../controllers/auth.controller");
const verify = require("../middleware/verify.middleware");
// const auth = require("../middleware/auth.middleware");

// server storage
const serverStorage = express.serverStorage;
console.log("serverStorage: ", express);

router.post("/auth/login", (req, res, next) =>
  authcontroller.login(req, res, next, serverStorage, db)
);
router.post(
  "/auth/signup",
  (req, res, next) => [
    verify.checkDuplicateEmail(req, res, next, serverStorage),
  ],
  (req, res, next) => authcontroller.create(req, res, next, serverStorage, db)
);

router.get("/auth/verify-user", (req, res, next) =>
  authcontroller.verifyUserWithEmail(req, res, next, serverStorage, db)
);

module.exports = router;
