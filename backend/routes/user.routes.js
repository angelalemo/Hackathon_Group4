const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.put("/:NID", UserController.updateUser);

module.exports = router;