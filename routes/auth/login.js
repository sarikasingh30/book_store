const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const myPassport = require("../../auth/passport");

router.post(
  "/",
  myPassport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    // async not required as we get user from passport.js and not taking anything from DB
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        provider: user.provider,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
  }
);

router.get(
  "/google",
  myPassport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  myPassport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: true, // <-- this must be enabled
  }),
  function (req, res) {
    user = req.user;
    // console.log(req.user);
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        provider: user.provider,
      }, // customize payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });
    res.status(201).redirect("http://localhost:3000");
  }
);

module.exports = router;
