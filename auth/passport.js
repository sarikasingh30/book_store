const passport = require("passport")
const User = require("../models/users")
const dotEnv = require("dotenv")
dotEnv.config()
const LocalStrategy = require("passport-local")
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',  // Use email instead of username
    passwordField: 'password',  // Ensure the password field is correct
},
    async function (email, password, done) {
        let user = await User.findOne({ email: email })
        try {
            if (!user) return done(null, false);
            // if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        }
        catch (err) {
            return done(err, false)
        }
    }

));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3030/login/auth/google/callback",
    scope: ['profile', 'email']
},
    async function (accessToken, refreshToken, profile, cb) {
        console.log("AccessToken", accessToken)
        console.log("refreshToken", refreshToken)
        console.log("profile", profile)
        
        try {
            let user = await User.findOne({
                googleId: profile.id
            })
            if (user) return cb(null, user)
            user = await User.create({
                googleAccessToken: accessToken,
                googleId: profile.id,
                email:"dummy@break.com",
                username:profile.displayName,
                password:"dummy-password"

            })
            cb(null, user)
        } catch (err) {
            cb(err, false)

        }

    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        let user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err, null);
    }

});

module.exports = passport