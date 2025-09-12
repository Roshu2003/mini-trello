const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authCtrl = require("../controllers/authController");

router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authCtrl.signup
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  authCtrl.login
);

module.exports = router;
