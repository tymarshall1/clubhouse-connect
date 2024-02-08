const User = require("../models/user");

exports.user_create_get = (req, res) => {
  res.render("create_user_form");
};

exports.user_login_get = (req, res) => {
  res.render("login_form");
};
