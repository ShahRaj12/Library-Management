const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  availability: { type: Boolean, default: true },
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  borrowedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Book", BookSchema);
