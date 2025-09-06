// routes/questions.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET random question by topic
router.get("/", async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ msg: "Topic is required" });
  }

  try {
    const count = await Question.countDocuments({ topic });
    if (count === 0) {
      return res.status(404).json({ msg: "No questions found for this topic" });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const question = await Question.findOne({ topic }).skip(randomIndex);
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
