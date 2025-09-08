const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      points: 0, // default 0
    });

    await newUser.save();
    res.status(201).json({ msg: "Registrasi berhasil, silakan verifikasi email Anda." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Password salah" });

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Email belum diverifikasi" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        points: user.points, // ⭐ kirim poin
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE POINTS (misalnya tambah poin setelah latihan)
router.post("/points", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body; // bisa positif (tambah) / negatif (kurang)
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    user.points += amount;
    await user.save();

    res.json({ msg: "Poin diperbarui", points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;