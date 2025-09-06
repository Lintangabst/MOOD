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
  const { fullName, phoneNumber, country, email, password, about } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      fullName,
      phoneNumber,
      country,
      email,
      password: hashedPassword,
      about,
      verificationToken,
      role: "user"
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ msg: "Registrasi berhasil. Silakan cek email untuk verifikasi." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Email belum diverifikasi. Silakan cek email Anda." });
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
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY EMAIL
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ msg: "Token tidak valid atau telah digunakan." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ msg: "Email berhasil diverifikasi!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CURRENT USER INFO
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
