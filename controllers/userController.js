const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.user_create_get = (req, res) => {
  res.render("create_user_form");
};

exports.user_create_post = [
  body("email", " *Email must be between 5 and 30 characters long.")
    .notEmpty()
    .trim()
    .isLength({
      min: 5,
      max: 30,
    })
    .toLowerCase()
    .escape()
    .custom(async (value) => {
      const user = await User.find({ email: value }).exec();
      if (user.length > 0) throw new Error(" *Email already in use");
    }),

  body("password", " *Password must be between 5 and 20 characters long.")
    .notEmpty()
    .trim()
    .isLength({
      min: 5,
      max: 20,
    })
    .escape(),

  body("confPassword", " *Passwords do not match")
    .notEmpty()
    .trim()
    .isLength({
      min: 5,
      max: 20,
    })
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),

  body("firstName", " *First name must be between 2 and 25 characters long.")
    .notEmpty()
    .trim()
    .isLength({
      min: 2,
      max: 25,
    })
    .toLowerCase()
    .escape(),

  body("lastName", " *First name must be between 2 and 25 characters long.")
    .notEmpty()
    .trim()
    .isLength({
      min: 2,
      max: 25,
    })
    .toLowerCase()
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let emailError = "";
      let passwordError = "";
      let confirmPasswordError = "";
      let firstNameError = "";
      let lastNameError = "";

      errors.array().forEach((err) => {
        if (err.path === "email") emailError = err.msg;
        if (err.path === "password") passwordError = err.msg;
        if (err.path === "confPassword") confirmPasswordError = err.msg;
        if (err.path === "firstName") firstNameError = err.msg;
        if (err.path === "lastName") lastNameError = err.msg;
      });

      res.render("create_user_form", {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailError,
        passwordError,
        confirmPasswordError,
        firstNameError,
        lastNameError,
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      await user.save();
      res.redirect("/users/login");
    });
  }),
];

exports.user_login_get = (req, res) => {
  res.render("login_form");
};

exports.user_login_post = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login_form", {
        email: req.body.email,
        invalidLogin: info.message,
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.user_logout_get = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.user_upgrade_gold_get = (req, res) => {
  res.render("upgrade_gold_form");
};

exports.user_upgrade_gold_post = [
  body("goldmemberCode").notEmpty().trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("upgrade_gold_form", { error: "Incorrect code" });
      return;
    }

    const goldCode = "admin";
    if (req.body.goldmemberCode === goldCode) {
      await User.updateOne(
        { _id: res.locals.currentUser._id.toString() },
        { role: "goldMember" }
      );
      res.redirect("/");
    } else res.render("upgrade_gold_form", { error: "Incorrect code" });
  }),
];
