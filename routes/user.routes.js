const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/:NID", UserController.updateUser);
router.delete("/:NID", UserController.deleteUser);

module.exports = router;