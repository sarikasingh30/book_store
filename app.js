// Imports
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const registerHandler = require("./routes/auth/register");
const loginHandler = require("./routes/auth/login");
const booksHandler = require("./routes/books");
const cartHandler = require("./routes/cart");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3030;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
//Setting up the session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/books", booksHandler);

app.use("/cart", cartHandler);

app.use("/register", registerHandler);

app.use("/login", loginHandler);

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
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
