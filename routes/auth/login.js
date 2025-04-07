const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const myPassport = require("../../auth/passport");

router.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/books"); //  Redirect to profile if user is already logged in
  }
});

router.post(
  "/",
  myPassport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    // async not required as we get user from passport.js and not taking anything from DB
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // customize payload
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.redirect("/books");
  }
);

router.get(
  "/google",
  myPassport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  myPassport.authenticate("google", {
    failureMessage: true,
    failureRedirect: "/login",
  }),
  function (req, res) {
    user = req.user;
    console.log(req.user);
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // customize payload
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.redirect("/books");
  }
);

module.exports = router;
