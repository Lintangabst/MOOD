// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true }, // e.g. 'adding'
  question: { type: String },              // Bisa kosong jika hanya pakai gambar
  image: { type: String },                 // URL atau path gambar
  correctAnswer: { type: Number, required: true },
});

module.exports = mongoose.model("Question", questionSchema);
