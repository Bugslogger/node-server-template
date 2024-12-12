const express = require("express");
const router = express.Router();

// auth controller
const authcontroller = require("../controllers/auth.controller");
const verify = require("../middleware/verify.middleware");

// server storage
const serverStorage = express.serverStorage;

router.post("/auth/login", [verify.checkDuplicateEmail], (req, res, next) =>
  authcontroller.login(req, res, next, serverStorage)
);
router.post("/auth/signup", [verify.checkDuplicateEmail], (req, res, next) =>
  authcontroller.login(req, res, next, serverStorage)
);

module.exports = router;
