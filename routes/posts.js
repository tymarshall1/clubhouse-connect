const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postController");

router.get("/create", postsController.create_post_get);

router.post("/create", postsController.create_post_post);

router.get("/delete/:id/", postsController.delete_post_get);

router.post("/delete/:id/", postsController.delete_post_post);

module.exports = router;
