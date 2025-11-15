// routes/filter.routes.js
const express = require('express');
const router = express.Router();
const FilterController = require('../controllers/filter.controller');

// POST หรือ GET ก็ได้ตามสะดวก
router.post('/', FilterController.filterFarms);
router.get('/', FilterController.filterFarms);

module.exports = router;
