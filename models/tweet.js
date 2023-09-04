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
const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
