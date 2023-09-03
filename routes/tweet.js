const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
// Create a new tweet
router.post("/newtweet", tweetController.createTweet);

// Like/Unlike a tweet
router.post("/like/:tweetId", tweetController.likeTweet);
router.post("/unlike/:tweetId", tweetController.unlikeTweet);

// Delete a tweet by ID
router.delete("/:tweetId", tweetController.deleteTweet);

// // Update a tweet by ID
// router.put("/:tweetId", tweetController.updateTweet);

// // Retrieve all tweets
// router.get("/alltweets", tweetController.retrieveTweets);

// Retrieve User tweets
router.get("/:userId", tweetController.getUserTweets);

module.exports = router;
