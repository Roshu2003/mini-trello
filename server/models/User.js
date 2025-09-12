const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true }, // keep if you hash passwords manually
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
