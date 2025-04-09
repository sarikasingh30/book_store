const passport = require("passport");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const dotEnv = require("dotenv");
dotEnv.config();
const LocalStrategy = require("passport-local");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use email instead of username
      passwordField: "password", // Ensure the password field is correct
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3030/login/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log("AccessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);

      try {
        let user = await User.findOne({
          googleId: profile.id,
        });
        if (user) return cb(null, user);

        user = await User.create({
          googleAccessToken: accessToken,
          googleId: profile.id,
          email: "dummy@email.com",
          username: profile.displayName,
          password: "dummy-password",
          provider: "google",
        });
        cb(null, user);
      } catch (err) {
        cb(err, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    let user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
