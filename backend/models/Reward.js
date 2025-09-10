const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pointsRequired: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", RewardSchema);
