// controllers/filter.controller.js
const FilterService = require('../service/filter.service');

class FilterController {
  static async filterFarms(req, res) {
    try {
      const filters = req.query.page
        ? req.query // ถ้ามาเป็น query string เช่น ?productName=คะน้า&page=1
        : req.body; // หรือถ้ามาใน body JSON

      const result = await FilterService.filterFarms(filters);

      res.status(200).json({
        status: 'success',
        message: 'Filter farms completed',
        ...result,
      });
    } catch (err) {
      console.error('Filter error:', err);
      res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
      });
    }
  }
}

module.exports = FilterController;
