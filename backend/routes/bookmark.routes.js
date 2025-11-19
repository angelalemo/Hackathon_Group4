const express = require("express");
const router = express.Router();
const BookmarkController = require("../controllers/bookmark.controller");

router.get("/user/:NID", BookmarkController.getBookmarksByUser);
router.get("/user/:NID/farm/:FID", BookmarkController.getBookmarksByUserAndFarm);
router.get("/check/:NID/:PID", BookmarkController.checkBookmark);
router.post("/add", BookmarkController.addBookmark);
router.delete("/remove/:NID/:PID", BookmarkController.removeBookmark);

module.exports = router;

