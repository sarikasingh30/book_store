const jwt = require("jsonwebtoken");

module.exports.check = (req, res) => {
  // Passport session-based check (current method)
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true, user: req.user });
  } else {
    return res
      .status(401)
      .json({ authenticated: false, message: "User not authenticated" });
  }
};
