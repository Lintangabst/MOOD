const express = require("express");
const mongoose = require("mongoose");
const Reward = require("../models/Reward");  
const User = require("../models/User");
const Redemption = require("../models/Redemption");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/rewards
 * List semua reward aktif
 */
router.get("/", async (req, res) => {
  try {
    const rewards = await Reward.find({}).sort({ createdAt: -1 });
    res.json(rewards);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch rewards" });
  }
});

/**
 * POST /api/rewards
 * Tambah reward baru (admin only)
 */
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  try {
    const { title, pointsRequired, stock = 1, active = true, description = "" } = req.body;
    const reward = await Reward.create({ title, pointsRequired, stock, active, description });
    res.status(201).json(reward);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create reward" });
  }
});

/**
 * PATCH /api/rewards/:id
 * Update reward (admin only)
 */
router.patch("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reward) return res.status(404).json({ message: "Reward not found" });
    res.json(reward);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update reward" });
  }
});

/**
 * DELETE /api/rewards/:id
 * Hapus reward (admin only)
 */
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });
    res.json({ message: "Reward deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete reward" });
  }
});

/**
 * POST /api/rewards/redeem
 * Redeem reward oleh user
 */
router.post("/redeem", auth, async (req, res) => {
  const { rewardId } = req.body;
  if (!rewardId) return res.status(400).json({ message: "rewardId required" });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.active) return res.status(400).json({ message: "Reward not available" });
    if (reward.stock <= 0) return res.status(400).json({ message: "Stok hadiah habis" });
    if (user.points < reward.pointsRequired) return res.status(400).json({ message: "Poin tidak mencukupi" });

    user.points -= reward.pointsRequired;
    reward.stock -= 1;

    await user.save();
    await reward.save();

    const redemption = await Redemption.create({
      user: user._id,
      reward: reward._id,
      status: "pending",
      pointsAtRedemption: reward.pointsRequired,
    });

    res.json({ message: "Penukaran berhasil diajukan", redemption, currentPoints: user.points });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || "Redeem failed" });
  }
});

module.exports = router;
