const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String },
  country: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  points: { type: Number, default: 0 }, // ⭐ default poin
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
