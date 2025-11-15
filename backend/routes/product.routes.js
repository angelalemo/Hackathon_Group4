const express = require('express');
const router = express.Router();
const ProductController = require("../controllers/product.controller");

router.get("/All", ProductController.getAll);
router.get("/:FID", ProductController.getAllByFarm);
router.get("/:PID", ProductController.getById);
router.post("/create", ProductController.create);
router.put("/update", ProductController.update);
router.delete("/delete", ProductController.delete);

module.exports = router;