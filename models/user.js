const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 5,
    maxLength: 30,
  },

  password: {
    type: String,
    required: true,
    minLength: 5,
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 25,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 25,
  },

  role: {
    type: String,
    required: true,
    enum: ["member", "goldMember", "admin"],
    default: "member",
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],

  joined: {
    type: Date,
    default: Date.now,
  },
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Users", userSchema);
