const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/create", userController.user_create_get);

// router.post("/create", userController.user_create_post);

router.get("/login", userController.user_login_get);

// router.post("/login", userController.user_login_post);

module.exports = router;
