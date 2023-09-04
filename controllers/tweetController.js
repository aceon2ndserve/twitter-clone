const Comment = require("../models/comments");
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

    return res.status(200).redirect(`/users/${tweetsOwner}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error" });
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

    return res.status(200).redirect(`/users/${tweetsOwner}`);
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

    return res.status(200).redirect(`/users/${tweetsOwner}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating comment" });
  }
};
// Update a tweet by ID
// exports.updateTweet = async (req, res) => {
//   const tweetId = req.params.tweetId;
//   const newText = req.body.text;

//   try {
//     const updatedTweet = await Tweet.findByIdAndUpdate(
//       tweetId,
//       { text: newText },
//       { new: true }
//     );

//     return res.status(200).json(updatedTweet);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error updating tweet" });
//   }
// };

// Retrieve all tweets
// exports.retrieveTweets = async (req, res) => {
//   try {
//     const tweets = await Tweet.find({});

//     return res.status(200).json(tweets);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error retrieving tweets" });
//   }
// };
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

// // In your controller
// exports.getTweetDetails = async (req, res) => {
//   try {
//     const tweetId = req.params.tweetId;
//     const currentUserId = req.session.userId;

//     const tweet = await Tweet.findById(tweetId).exec();

//     // Check if the tweet is liked by the current user
//     const isLikedByCurrentUser = tweet.likedBy.includes(currentUserId);

//     // Render the tweet details with the isLikedByCurrentUser property
//     res.render("tweet-details", { tweet, isLikedByCurrentUser });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error retrieving tweet details" });
//   }
// };
