const User = require("../models/user");
const Tweet = require("../models/tweet");
const bcrypt = require("bcrypt");
const passport = require("../authentication/passport");
const Comment = require("../models/comments");
// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const currentUserId = req.session.userId;

  try {
    const user = await User.findById(userId).exec();
    const followingUserIds = await user.following.map((user) =>
      user.toString()
    );

    const username = await req.user.username;
    const users = await User.find({}).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve the user's tweets
    const tweets = await Tweet.find({ user: userId })
      .populate("comments")
      .exec();
    for (const tweet of tweets) {
      tweet.isLikedByCurrentUser = tweet.likedBy.includes(currentUserId);
    }

    // Render the user's profile page with the user and tweet data
    return res.render("profile", {
      user,
      tweets,
      username,
      users,
      followingUserIds,
      currentUserId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error retrieving user profile" });
  }
};

// // Edit user profile by ID
// exports.editUserProfile = async (req, res) => {
//   const userId = req.params.userId;
//   const updatedData = req.body;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
//       new: true,
//     }).exec();

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.status(200).json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error updating user profile" });
//   }
// };
// Create a new user
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Hash the password before storing it
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating user" });
  }
};
exports.login = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username;
    const users = await User.find({}).exec();

    // Store the user's ID in the session (assuming you are using express-session)
    req.session.userId = userId;
    const tweets = await Tweet.find({ user: userId }).exec();

    // Redirect to the user's profile page or some other route
    res.redirect(`/users/${userId}`);
  } catch (error) {
    // Handle any errors

    // Display flash messages (if any)
    const errorMessage = req.flash("error")[0]; // Get the first error message
    console.error(error);
    res.render("index", { errorMessage });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/"); // Redirect to the homepage or any other desired page after logout
  });
};

// Follow a user
exports.followUser = async (req, res) => {
  const currentUserId = req.session.userId;
  const userIdToFollow = req.params.userId;

  try {
    const userToFollow = await User.findById(userIdToFollow);

    if (!userToFollow) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    // Check if the current user is already following the userToFollow
    const isAlreadyFollowing = userToFollow.followers.includes(currentUserId);

    if (isAlreadyFollowing) {
      return res.status(400).json({ error: "User is already being followed" });
    }

    // Add current user's ID to the followers array of the user to follow
    await User.findByIdAndUpdate(userIdToFollow, {
      $addToSet: { followers: currentUserId },
    });

    // Add user to follow's ID to the following array of the current user
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userIdToFollow },
    });
    res.redirect(`/users/${currentUserId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error following user" });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  const currentUserId = req.session.userId;
  const userIdToUnfollow = req.params.userId;

  try {
    // Remove current user's ID from the following array of the user to unfollow
    await User.findByIdAndUpdate(userIdToUnfollow, {
      $pull: { followers: currentUserId },
    });

    // Remove user to unfollow's ID from the following array of the current user
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userIdToUnfollow },
    });

    res.redirect(`/users/${currentUserId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error unfollowing user" });
  }
};
