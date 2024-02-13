const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Post = require("../models/post");

exports.homepage_get = asyncHandler(async (req, res) => {
  const allPosts = await Post.find({})
    .populate("author")
    .sort({ created: -1 })
    .exec();
  res.render("index", { allPosts });
});
