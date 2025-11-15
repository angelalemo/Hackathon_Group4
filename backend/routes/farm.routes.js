const express = require("express");
const router = express.Router();
const FarmController = require("../controllers/farm.controller");

router.get("/:FID", FarmController.getFarmbyFarmID);     // ทุกคนดูได้
router.get("/:NID", FarmController.getFarmbyUserID);
router.get("/:FID", FarmController.getFarmWithProducts);
router.get("/All", FarmController.getAllFarmsWithProducts);    
router.post("/create", FarmController.createFarm);    // เฉพาะ Farmer
router.put("/updateInfo", FarmController.updateFarmInfo);    // เฉพาะ Farmer
router.put("/addStorage", FarmController.addFarmImageAndVideo);    // เฉพาะ Farmer
router.put("/deleteStorage", FarmController.deleteFarmImageAndVideo);    // เฉพาะ Farmer

module.exports = router;