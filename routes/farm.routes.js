const express = require("express");
const router = express.Router();
const FarmController = require("../controllers/farm.controller");

router.get("/", FarmController.getAllFarm);     // ทุกคนดูได้
router.get("/farm", FarmController.getFarm);     // ทุกคนดูได้
router.post("/", FarmController.createFarm);    // เฉพาะ Farmer
router.put("/", FarmController.updateFarm);     // เฉพาะ Farmer


module.exports = router;