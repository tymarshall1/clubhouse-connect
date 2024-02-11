const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Post = require("../models/post");

exports.create_post_get = (req, res) => {
  res.render("create_post_form");
};

exports.create_post_post = [
  body("title", " *Title must be between 2 and 30 characters.")
    .trim()
    .toLowerCase()
    .isLength({ min: 2, max: 30 })
    .escape(),

  body("body", " *Body must be at least 5 characters long.")
    .trim()
    .toLowerCase()
    .isLength({ min: 5 })
    .escape(),

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

    const post = new Post({
      title: req.body.title,
      body: req.body.body,
    });

    const newPost = await post.save();
    const user = await User.findById(
      res.locals.currentUser._id.toString()
    ).exec();

    user.posts.push(newPost._id);
    await user.save();
    res.redirect("/");
  }),
];
