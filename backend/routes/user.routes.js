const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/All", UserController.getAllUser);
router.get("/:NID", UserController.getUserById);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.put("/update/:NID", UserController.updateUser);
router.put("/profileImage", UserController.updateUserProfileImage);
router.post("/reset-password", UserController.resetPassword);

module.exports = router;