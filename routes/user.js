const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const ensureAuthenticated = require("../middlewares/middlewares");
router.get("/logout", ensureAuthenticated, userController.logout);
router.get("/:userId", ensureAuthenticated, userController.getUserProfile);
// router.post("/:userId/edit", userController.editUserProfile);
router.post("/newuser", userController.createUser);
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", {
      failureRedirect: "/", // Redirect to login page on failure
      failureFlash: true,
    })(req, res, next);
  },
  userController.login
);
router.post("/follow/:userId", userController.followUser);
router.post("/unfollow/:userId", userController.unfollowUser);

module.exports = router;
