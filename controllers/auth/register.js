const bcrypt = require("bcrypt");
const Users = require("../../models/users");

module.exports.postRegister = async (req, res) => {
  let { username, email, password } = req.body;
  // console.log(username, email, password);
  try {
    let user = await Users.findOne({ email });
    if (user) {
      res.status(400).send("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ username, email, password: hashedPassword });
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
