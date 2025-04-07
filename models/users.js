const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  googleAccessToken: { type: String },
  username: { type: String },
  profileImg: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
});
module.exports = mongoose.model("user", userSchema);
