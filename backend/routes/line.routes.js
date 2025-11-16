const express = require("express");
const router = express.Router();
const LineController = require("../controllers/line.controller");

router.get("/callback", LineController.lineCallback);


module.exports = router;