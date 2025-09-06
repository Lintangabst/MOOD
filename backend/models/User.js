const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String },
  country: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" } 
});

module.exports = mongoose.model("User", userSchema);
