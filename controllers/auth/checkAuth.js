module.exports.check = (req, res) => {
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) return res.json({ authenticated: false });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("check-auth", user);
    res.json({ authenticated: true, user });
  } catch (err) {
    res.json({ authenticated: false });
  }
};
