const express = require("express");
const router = express.Router();
const OTPController = require("../controllers/otp.controller");

router.post("/send", OTPController.sendOTP);
router.post("/verify", OTPController.verifyOTP);

module.exports = router;

