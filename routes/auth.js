const express = require("express");
const { check, body } = require("express-validator/check");
const authController = require("../controllers/auth");
const router = express.Router();
const User = require("../models/user");

// /login/
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email adress")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              "E-mail already exists, please pick a different one"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters long"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password have to match");
        }
        return true;
      })
      .trim()
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
