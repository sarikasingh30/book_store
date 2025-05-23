// Imports
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const registerHandler = require("./routes/auth/register");
const checkAuthHandler = require("./routes/auth/checkAuth");
const loginHandler = require("./routes/auth/login");
const booksHandler = require("./routes/books");
const cartHandler = require("./routes/cart");
const moodSuggestionHandler = require("./routes/mood");
const summaryHandler = require("./routes/summary");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3030;
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies or sessions if needed
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Setting up the session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // false in dev
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/check-auth", checkAuthHandler);
app.use("/books", booksHandler);
app.use("/api/mood", moodSuggestionHandler);
app.use("/api/summary", summaryHandler);
app.use("/login", loginHandler);
app.use("/register", registerHandler);
app.use("/cw", cartHandler);

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Error while logging out");
    }

    // DESTROY session after logout
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error while destroying session");
      }
      res.clearCookie("connect.sid"); // Important to clear cookie from browser
      res.status(200).send("Logged out successfully");
    });
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, (err) => {
      if (err) {
        console.log(`Error: `, err);
      } else {
        console.log(`Listening on PORT : ${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.log("error", err);
  });
