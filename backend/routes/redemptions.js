const express = require("express");
const mongoose = require("mongoose");
const Redemption = require("../models/Redemption");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/redemptions/list
 * List semua redemption (admin only)
 */
router.get("/list", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  try {
    const redemptions = await Redemption.find()
      .populate("user", "fullName email")
      .populate("reward", "title pointsRequired stock active");
    res.json(redemptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch redemptions" });
  }
});

/**
 * PATCH /api/redemptions/:id
 * Update status redemption (admin only)
 */
router.patch("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  try {
    const { status } = req.body;
    if (!["pending", "processing", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const redemption = await Redemption.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!redemption) return res.status(404).json({ message: "Redemption not found" });
    res.json(redemption);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update redemption status" });
  }
});

/**
 * GET /api/redemptions/summary
 * Summary redemption per user
 */
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const agg = await Redemption.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const summary = { pending: 0, processing: 0, accepted: 0, rejected: 0 };
    agg.forEach((i) => (summary[i._id] = i.count));

    res.json({
      pending: summary.pending,
      processing: summary.processing,
      completed: summary.accepted,
      rejected: summary.rejected,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch summary failed" });
  }
});

module.exports = router;
