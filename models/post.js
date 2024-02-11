const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 2,
    maxLength: 30,
  },

  body: {
    type: String,
    required: true,
    minLength: 5,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", postSchema);
