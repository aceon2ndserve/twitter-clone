const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const passport = require("./authentication/passport");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");

app.use(flash());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
mongoose.connect(
  "mongodb+srv://taskapp1:panathas@cluster0.9p33sdx.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

// Handle connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const routes = require("./routes");
app.use("/", routes);

app.listen(port, () => console.log("Listening to port + ", port));
