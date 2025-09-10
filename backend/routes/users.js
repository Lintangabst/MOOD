const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // jangan kirim password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data user" });
  }
});

// Add new user
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: true, // opsional auto verified
    });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ error: "Gagal menambahkan user", details: err.message });
  }
});

// Update user (role atau isVerified)
router.patch("/:id", async (req, res) => {
  try {
    const { role, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(role && { role }), ...(isVerified !== undefined && { isVerified }) },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Gagal update user" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User dihapus" });
  } catch (err) {
    res.status(400).json({ error: "Gagal menghapus user" });
  }
});

module.exports = router;
