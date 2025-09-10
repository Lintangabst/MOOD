const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const CustomQuestion = require("../models/CustomQuestion");
const Redemption = require("../models/Redemption");
const auth = require("../middleware/auth");

const router = express.Router();

// Hanya admin yang boleh akses
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    // Jumlah user
    const totalUsers = await User.countDocuments();

    // Jumlah custom questions
    const totalCustomQuestions = await CustomQuestion.countDocuments();

    // Summary redemption
    const redemptionAgg = await Redemption.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const redemptionSummary = { pending: 0, processing: 0, accepted: 0, rejected: 0 };
    redemptionAgg.forEach((i) => (redemptionSummary[i._id] = i.count));

    res.json({
      totalUsers,
      totalCustomQuestions,
      redemptionSummary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch admin summary failed" });
  }
});

module.exports = router;
