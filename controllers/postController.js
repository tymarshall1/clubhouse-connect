const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Post = require("../models/post");

exports.create_post_get = (req, res) => {
  res.render("create_post_form");
};

exports.create_post_post = [
  body("title", " *Title must be between 2 and 60 characters.")
    .trim()
    .toLowerCase()
    .isLength({ min: 2, max: 60 }),

  body("body", " *Body must be at least 5 characters long.")
    .trim()
    .isLength({ min: 5 }),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let titleError = "";
      let bodyError = "";

      errors.array().forEach((err) => {
        if (err.path === "title") titleError = err.msg;
        if (err.path === "body") bodyError = err.msg;
      });

      res.render("create_post_form", {
        title: req.body.title,
        body: req.body.body,
        titleError,
        bodyError,
      });
      return;
    }

    const userId = res.locals.currentUser._id.toString();

    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      author: userId,
    });

    const newPost = await post.save();
    const user = await User.findById(userId).exec();

    user.posts.push(newPost._id);
    await user.save();
    res.redirect("/");
  }),
];

exports.delete_post_get = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId).populate("author").exec();
  res.render("confirm_delete", { post });
});

exports.delete_post_post = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author").exec();
  const userId = post.author._id.toString();
  const postIdToRemove = post._id.toString();

  await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { posts: postIdToRemove } },
    { new: true }
  );

  await Post.deleteOne({ _id: post._id.toString() });

  res.redirect("/");
});
