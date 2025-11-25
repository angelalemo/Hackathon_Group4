const express = require("express");
const router = express.Router();
const FarmController = require("../controllers/farm.controller");

router.get("/All", FarmController.getAllFarm);    
router.get("/AllwithProducts", FarmController.getAllFarmsWithProducts);    
router.get("/:FID", FarmController.getFarmbyFarmID);
router.get("/user/:NID", FarmController.getFarmbyUserID); // แนะนำเปลี่ยน prefix เพื่อไม่ให้ชนกับ FID
router.get("/:FID/products", FarmController.getFarmWithProducts);  
router.post("/create", FarmController.createFarm);    // เฉพาะ Farmer
router.put("/updateInfo", FarmController.updateFarmInfo);    // เฉพาะ Farmer
router.put("/addStorage", FarmController.addFarmImageAndVideo);    // เฉพาะ Farmer
router.put("/deleteStorage", FarmController.deleteFarmImageAndVideo);    // เฉพาะ Farmer
router.put("/profileImage", FarmController.updateProfileImage);    // เฉพาะ Farmer
router.post("/certificate", FarmController.addCertificate);    // เฉพาะ Farmer
router.delete("/certificate", FarmController.deleteCertificate);    // เฉพาะ Farmer
router.delete("/:FID", FarmController.deleteFarm);    // เฉพาะ Farmer

module.exports = router;