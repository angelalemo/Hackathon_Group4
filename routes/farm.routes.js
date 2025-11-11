const express = require("express");
const router = express.Router();
const FarmController = require("../controllers/farmController");

router.get("/", FarmController.getAll);     // ทุกคนดูได้
router.post("/", FarmController.create);    // เฉพาะ Farmer
router.put("/", FarmController.update);     // เฉพาะ Farmer

module.exports = router;