const mongoose = require("mongoose");

const WikiSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  content: {
    type: String,
    required: [true, "Please provide a content"],
    minlength: 3,
  },
  author: {
    type: String,
    required: [true, "Please provide author name"],
    minlength: 3,
  },
  photo: {
    type: String,
    default: "article.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
});

const Wiki = mongoose.model("Wiki", WikiSchema);

module.exports = Wiki;
