const User = require("../models/user");
const Comment = require("../models/comments");
const Tweet = require("../models/tweet");

// Create a new tweet
exports.createTweet = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { text } = req.body;
  const hashtags = text.match(/#\w+/g);
  const { userId } = req.session;
  console.log(userId);
  try {
    const newTweet = new Tweet({
      text,
      user: userId,
      hashtags: hashtags || [],
    });

    // Save the tweet to the database
    const savedTweet = await newTweet.save();

    return res.redirect(`back`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating tweet" });
  }
};

// Like a tweet
exports.likeTweet = async (req, res) => {
  try {
    const currentUserId = req.session.userId;
    const tweetId = req.params.tweetId;

    const tweet = await Tweet.findById(tweetId).exec();
    const isLikedByCurrentUser = tweet.likedBy.includes(currentUserId);
    tweet.isLikedByCurrentUser = isLikedByCurrentUser;
    const tweetsOwner = tweet.user;
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    // Use the likeTweet method to add the user's ID to the likedBy array
    await tweet.likeTweet(currentUserId);

    return res.status(200).redirect(`back`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error" });
  }
};

//repost a tweet

exports.retweetTweet = async (req, res) => {
  try {
    const currentUserId = req.session.userId;
    const tweetId = req.params.tweetId;

    // Find the tweet to be retweeted
    const tweet = await Tweet.findById(tweetId).exec();

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Check if the user has already retweeted this tweet
    if (tweet.retweets.includes(currentUserId)) {
      return res
        .status(400)
        .json({ error: "You've already retweeted this tweet" });
    }
    const newRetweet = {
      user: currentUserId, // The user who retweeted
      originalTweet: tweetId, // The ID of the original tweet being retweeted
    };
    // Add the user's ID to the retweets array
    tweet.retweets.push(newRetweet);

    // Save the updated tweet
    await tweet.save();

    return res.status(200).redirect("back");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error retweeting tweet" });
  }
};

//Unretweet
exports.unretweetTweet = async (req, res) => {
  try {
    const currentUserId = req.session.userId;
    const tweetId = req.params.tweetId;

    // Find the tweet to be unretweeted
    const tweet = await Tweet.findById(tweetId).exec();

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Check if the user has retweeted this tweet
    const retweet = tweet.retweets.find(
      (rt) => rt && rt.user && rt.user.toString() === currentUserId
    );

    if (!retweet) {
      return res
        .status(400)
        .json({ error: "You have not retweeted this tweet" });
    }

    // Remove the retweet from the tweet's retweets array
    tweet.retweets = tweet.retweets.filter(
      (rt) => rt && rt.user && rt.user.toString() !== currentUserId
    );

    // Save the updated tweet
    await tweet.save();

    return res.status(200).redirect("back");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error unretweeting tweet" });
  }
};

// Delete a tweet by ID
exports.deleteTweet = async (req, res) => {
  const tweetId = req.params.tweetId;
  const { userId } = req.session;

  try {
    await Tweet.findByIdAndDelete(tweetId);

    return res.redirect(`back`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error deleting tweet" });
  }
};
//Unlike a tweet

exports.unlikeTweet = async (req, res) => {
  const tweetId = req.params.tweetId;
  const userId = req.session.userId; // Assuming you have a user's ID in the session

  try {
    const tweet = await Tweet.findById(tweetId).exec();
    const tweetsOwner = tweet.user;
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Use the unlikeTweet method to remove the user's ID from the likedBy array
    await tweet.unlikeTweet(userId);

    return res.status(200).redirect(`back`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error unliking tweet" });
  }
};
exports.createComment = async (req, res) => {
  const { text } = req.body;
  const { userId } = req.session;
  const tweetId = req.params.tweetId;

  try {
    const newComment = new Comment({
      text,
      user: userId,
      tweet: tweetId,
    });

    await newComment.save();

    // Update the tweet to include the new comment
    const tweet = await Tweet.findById(tweetId);
    const tweetsOwner = tweet.user;
    tweet.comments.push(newComment._id);
    await tweet.save();

    return res.status(200).redirect(`back`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating comment" });
  }
};
// Retrieve tweets of a specific user
exports.getUserTweets = async (req, res) => {
  const userId = req.params.userId;

  try {
    const tweets = await Tweet.find({ user: userId });

    return res.status(200).json(tweets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error retrieving user tweets" });
  }
};
