const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

const customQuestionSetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    accessCode: { type: String, required: true, unique: true },
    questions: [questionSchema],
    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      fullName: String,
      email: String,
    },
    // ✅ Tambahkan attempts
    attempts: [
      {
        user: {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          fullName: String,
          email: String,
        },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomQuestionSet", customQuestionSetSchema);
