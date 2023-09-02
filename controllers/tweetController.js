const Tweet = require("../models/tweet");

// Create a new tweet
exports.createTweet = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { text } = req.body;

  const { userId } = req.session;
  console.log(userId);
  try {
    const newTweet = new Tweet({
      text,
      user: userId,
    });

    // Save the tweet to the database
    const savedTweet = await newTweet.save();

    return res.redirect(`/users/${userId}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating tweet" });
  }
};

// Delete a tweet by ID
exports.deleteTweet = async (req, res) => {
  const tweetId = req.params.tweetId;
  const { userId } = req.session;

  try {
    await Tweet.findByIdAndDelete(tweetId);

    return res.redirect(`/users/${userId}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error deleting tweet" });
  }
};

// Update a tweet by ID
exports.updateTweet = async (req, res) => {
  const tweetId = req.params.tweetId;
  const newText = req.body.text;

  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { text: newText },
      { new: true }
    );

    return res.status(200).json(updatedTweet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error updating tweet" });
  }
};

// Retrieve all tweets
exports.retrieveTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({});

    return res.status(200).json(tweets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error retrieving tweets" });
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
