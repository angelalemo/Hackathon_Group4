const express = require('express');
const router = express.Router();
const ProductController = require("../controllers/product.controller");

router.get("/", ProductController.getAllByFarm);
router.get("/:PID", ProductController.getById);
router.post("/", ProductController.create);
router.put("/", ProductController.update);
router.delete("/", ProductController.delete);

module.exports = router;