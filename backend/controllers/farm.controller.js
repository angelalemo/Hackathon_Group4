const FarmService = require("../service/farm.service");

class FarmController {
  static async getAllFarm(req, res) {
    try {
      const farms = await FarmService.getAllFarms();
      res.status(200).json(farms);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getFarm(req, res) {
  try {
    const { farmID } = req.params; // ✅ ใช้ params แทน query
    const farm = await FarmService.getFarm({ farmID }); // ✅ ใช้ farm ตัวเดียว
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }
    res.status(200).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


  static async createFarm(req, res) {
  try {
    const { NID, ...data } = req.body; // ดึง userNID จาก body
    const farm = await FarmService.createFarm(NID, data);
    res.status(201).json({ message: "Farm created successfully", farm });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


  static async updateFarm(req, res) {
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