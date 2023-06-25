const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../Middlewares/authMiddleware");
const User = require("../Models/UserModel");
const { body } = require("express-validator");

const router = express.Router();

router.route("/signup").post(
  [
    body("name").not().isEmpty().withMessage("Enter your name"),
    body("email")
      .isEmail()
      .withMessage("Enter your email")
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject("Email is already exist");
          }
        });
      }),
    body("password").not().isEmpty().withMessage("Enter your password"),
  ],
  authController.createUser
);


router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboard);
router.route("/:id").delete(authController.deleteUser);

module.exports = router;
