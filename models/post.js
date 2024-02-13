const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 2,
    maxLength: 60,
  },

  body: {
    type: String,
    required: true,
    minLength: 5,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

postSchema.virtual("formattedDate").get(function () {
  return DateTime.fromJSDate(this.created, {
    zone: "America/New_York",
  }).toLocaleString(DateTime.DATETIME_SHORT);
});

module.exports = mongoose.model("Posts", postSchema);
