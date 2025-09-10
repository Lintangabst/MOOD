const mongoose = require("mongoose");

const CustomQuestionAccessSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomQuestion",
      required: true,
    },
    accessedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }, // jumlah soal yang sudah dijawab
    finished: { type: Boolean, default: false }, // true jika semua soal selesai
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomQuestionAccess", CustomQuestionAccessSchema);
