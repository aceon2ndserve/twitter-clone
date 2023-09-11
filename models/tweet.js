const User = require("./user");
const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  retweets: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      originalTweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
      },
    },
  ],
  hashtags: [{ type: String }],
});

tweetSchema.methods.likeTweet = function (userId) {
  if (!this.likedBy.includes(userId)) {
    this.likedBy.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};
// Method to remove a like from a tweet
tweetSchema.methods.unlikeTweet = function (userId) {
  if (this.likedBy.includes(userId)) {
    this.likedBy.pull(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// // In the Tweet model file
// tweetSchema.statics.findTweetsWithUsernames = function () {
//   return this.find({}).populate("TwitterUsers", "username");
// };

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
