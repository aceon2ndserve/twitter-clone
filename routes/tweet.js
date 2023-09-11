const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const ensureAuthenticated = require("../middlewares/middlewares");
// Create a new tweet
router.post("/newtweet", tweetController.createTweet);

// Like/Unlike a tweet
router.post("/like/:tweetId", tweetController.likeTweet);
router.post("/unlike/:tweetId", tweetController.unlikeTweet);

// Retweet
router.post(
  "/retweet/:tweetId",
  ensureAuthenticated,
  tweetController.retweetTweet
);
// Unretweet
router.post(
  "/unretweet/:tweetId",
  ensureAuthenticated,
  tweetController.unretweetTweet
);
// Delete a tweet by ID
router.delete("/:tweetId", tweetController.deleteTweet);

// Creaate a comment
router.post("/comments/:tweetId", tweetController.createComment);
// Retrieve User tweets
router.get("/:userId", tweetController.getUserTweets);

module.exports = router;
