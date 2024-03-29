const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/create", userController.user_create_get);

router.post("/create", userController.user_create_post);

router.get("/login", userController.user_login_get);

router.post("/login", userController.user_login_post);

router.get("/logout", userController.user_logout_get);

router.get("/upgrade-gold/", userController.user_upgrade_gold_get);

router.post("/upgrade-gold/", userController.user_upgrade_gold_post);

module.exports = router;
