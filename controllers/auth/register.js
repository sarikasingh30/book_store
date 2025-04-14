const bcrypt = require("bcrypt");
const Users = require("../../models/users");

module.exports.postRegister = async (req, res) => {
  let { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    let user = await Users.findOne({ email });
    if (user) {
      return res.send("Email already exists");
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res.status(500).send("Error hashing password");
      }

      await Users.create({ username, email, password: hash });
      res.status(201).send("User registered successfully");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
