const express = require("express");
const router = express.Router();
const FarmController = require("../controllers/farm.controller");

router.get("/", FarmController.getAllFarm);     // ทุกคนดูได้
router.get("/:farmID", FarmController.getFarmbyFarmID);     // ทุกคนดูได้
router.get("/:NID", FarmController.getFarmbyUserID);
router.post("/create", FarmController.createFarm);    // เฉพาะ Farmer
router.put("/update", FarmController.updateFarm);     // เฉพาะ Farmer


module.exports = router;