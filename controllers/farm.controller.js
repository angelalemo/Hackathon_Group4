const FarmService = require("../services/farmService");

class FarmController {
  static async getAll(req, res) {
    try {
      const farms = await FarmService.getAllFarms();
      res.status(200).json(farms);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getFarm(req, res) {
    try {
      const { farmID, userNID } = req.query;
      const farms = await FarmService.getFarm({ farmID, userNID });
      res.status(200).json(farm);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const userNID = req.body.NID; // ดึงจาก user ที่ส่งมา
      const farm = await FarmService.createFarm(userNID, req.body);
      res.status(201).json({ message: "Farm created successfully", farm });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { NID, FID } = req.body;
      const farm = await FarmService.updateFarm(NID, FID, req.body);
      res.status(200).json({ message: "Farm updated successfully", farm });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FarmController;