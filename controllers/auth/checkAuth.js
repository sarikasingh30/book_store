const jwt = require("jsonwebtoken");
module.exports.check = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true, user: req.user });
  } else {
    return res.status(401).json({ authenticated: false });
  }
};
