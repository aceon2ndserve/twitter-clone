const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const tweetRoutes = require("./tweet");

router.use("/users", userRoutes);
router.use("/tweets", tweetRoutes);
router.get("/", (req, res) => {
  const errorMessage = req.flash("error");

  res.render("index", { errorMessage });
});

module.exports = router;
