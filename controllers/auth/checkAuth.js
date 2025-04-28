module.exports.check = (req, res) => {
  // Passport session-based check (current method)
  if (req.isAuthenticated()) {
    // Send user data from session
    return res.status(200).json({
      authenticated: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        provider: req.user.provider,
      },
    });
  } else {
    return res.status(401).json({
      authenticated: false,
      message: "User not authenticated",
    });
  }
};
