const express = require("express");
const router = express.Router();
const myPassport = require("../../auth/passport");
require("dotenv").config();
router.post(
  "/",
  myPassport.authenticate("local", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  function (req, res) {
    // async not required as we get user from passport.js and not taking anything from DB
    const user = req.user;
    console.log("localuser", user);

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
    failureRedirect: process.env.FRONTEND_URL + "/login",
    session: true,
  }),
  function (req, res) {
    const user = req.user;
    // console.log("googleuser", user);
    res.status(201).redirect(process.env.FRONTEND_URL + "/");
  }
);

module.exports = router;
