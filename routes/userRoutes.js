const express = require("express");
const userController = require("./../controller/userController");
const authController = require("../controller/authControler");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all all route after this middleware
router.use(authController.protect);

router.patch(
  "/updateMyPassword",
  authController.updatePassword
);

router.get(
  "/me",

  userController.getMe,
  userController.getUser
);

router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete("/deleteMe", userController.deleteMe);

// Restrict routes to admin only
router.use(authController.restrictTo("admin"));

router
  .route("/user")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/user/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
