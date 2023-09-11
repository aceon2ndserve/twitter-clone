const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const tweetRoutes = require("./tweet");
const Tweet = require("../models/tweet");
const HomeController = require("../controllers/homeController");
const ensureAuthenticated = require("../middlewares/middlewares");
router.use("/users", userRoutes);
router.use("/tweets", tweetRoutes);
router.get("/", (req, res) => {
  const errorMessage = req.flash("error");
  const messages = req.flash("success");
  res.render("index", { errorMessage, messages });
});
router.get("/home", ensureAuthenticated, HomeController.getHomePage);
router.get("/hashtags/:hashtag",ensureAuthenticated, async (req, res) => {
  const userId = req.user.id
  const username = req.user.username;

  const hashtag = req.params.hashtag;
  const tweetsWithHashtag = await Tweet.find({
    hashtags: `#${hashtag}`,
  }).populate("user");
  res.render("hashtag", { tweets: tweetsWithHashtag, hashtag, userId, username });
});
module.exports = router;
