const express = require("express");
const CustomQuestionSet = require("../models/CustomQuestion");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 🔹 Helper untuk generate accessCode unik
function generateAccessCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ✅ Create Custom Questions (siapapun user bisa buat)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!title || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Judul dan pertanyaan wajib diisi" });
    }

    const accessCode = generateAccessCode();

    const newSet = new CustomQuestionSet({
      title,
      accessCode,
      questions,
      createdBy: {
        userId: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
      },
    });

    await newSet.save();
    res.status(201).json({
      message: "Soal custom berhasil dibuat",
      accessCode: newSet.accessCode,
    });
  } catch (err) {
    console.error("Error create custom question:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Custom Questions by Access Code
router.get("/:accessCode", authMiddleware, async (req, res) => {
  try {
    const { accessCode } = req.params;
    const set = await CustomQuestionSet.findOne({ accessCode });
    if (!set) {
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }
    res.json(set);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Custom Questions (untuk admin dashboard)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sets = await CustomQuestionSet.find();
    res.json(sets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Custom Questions
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CustomQuestionSet.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }
    res.json({ message: "Soal berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Attempt Question (user mencoba soal)
router.post("/:id/attempt", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const set = await CustomQuestionSet.findById(id);
    if (!set) {
      return res.status(404).json({ message: "Soal tidak ditemukan" });
    }

    set.attempts.push({
      user: {
        userId: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
      },
      completed: completed || false,
    });

    await set.save();
    res.json({ message: "Attempt berhasil dicatat" });
  } catch (err) {
    console.error("Error attempt:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
