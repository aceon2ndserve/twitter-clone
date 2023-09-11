const Tweet = require("../models/tweet");

// Define the controller method for the home page
exports.getHomePage = async (req, res) => {
  try {
    // Fetch all tweets from the database and populate the "comments" field
    const tweets = await Tweet.find({})
      .populate([
        {
          path: "comments",
          populate: {
            path: "user",
            model: "User",
          },
        },
        {
          path: "retweets.user", // Populate the "user" field within "retweets"
          model: "User",
        },
        {
          path: "user",
          model: "User",
        },
      ])
      .exec();

    // Calculate the isLikedByCurrentUser property for each tweet
    tweets.forEach((tweet) => {
      tweet.isLikedByCurrentUser = tweet.likedBy.includes(req.session.userId);
    });

    // Render the home page with the retrieved tweets
    res.render("home", {
      tweets,
      userId: req.session.userId,
      username: req.user ? req.user.username : null,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error loading the home page" });
  }
};
