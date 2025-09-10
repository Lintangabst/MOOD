const express = require("express");
const CustomQuestion = require("../models/CustomQuestion");
const auth = require("../middleware/auth");

const router = express.Router();

// Hanya admin
router.get("/monthly", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const stats = await CustomQuestion.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalQuestions: { $sum: { $size: "$questions" } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch monthly stats failed" });
  }
});

module.exports = router;
