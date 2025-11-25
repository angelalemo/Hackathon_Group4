const FarmService = require("../service/farm.service");

class FarmController {

  static async getFarmWithProducts(req, res) {
    try {
      const { FID } = req.params;
      const farm = await FarmService.getFarmWithProducts(FID); // ✅ ใช้ farm ตัวเดียว
      if (!farm) {
        return res.status(404).json({ message: "Farm not found" });
      }
      res.status(200).json(farm);
    } catch (error) {
      res.status(400).json({ error: error.message });
      }
  }

  static async getAllFarmsWithProducts(req, res) {
    try {
      const farms = await FarmService.getAllFarmsWithProducts();
      res.status(200).json(farms);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } 

  static async getAllFarm(req, res) {
    try {
      const farms = await FarmService.getAllFarms();
      res.status(200).json(farms);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getFarmbyFarmID(req, res) {
  try {
    const FID  = req.params;
    const farm = await FarmService.getFarmbyFarmID( FID ); // ✅ ใช้ farm ตัวเดียว
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }
    res.status(200).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

  static async getFarmbyUserID(req, res) {
    try {
      const { NID } = req.params; // ✅ ใช้ params แทน query
      const farm = await FarmService.getFarmbyNID({ NID }); // ✅ ใช้ farm ตัวเดียว
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

  static async updateFarmInfo(req, res) {
    try {
      const { NID, FID, ...data } = req.body; // ดึง userNID จาก body
      const farm = await FarmService.updateFarmInfo(NID, FID, data);
      res.status(200).json({ message: "Farm updated successfully", farm });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
 }
  
  static async addFarmImageAndVideo(req, res) {
    try {
      const { NID, FID, storages  } = req.body;
      const farm = await FarmService.addStorage(NID, FID, storages);
      res.status(200).json({ message: "Farm image added successfully", farm });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteFarmImageAndVideo(req, res) {
    try {
      const { NID, FID, storagesID } = req.body;
      const farm = await FarmService.deleteStorage(NID, FID, storagesID);
      res.status(200).json({ message: "Farm image deleted successfully", farm });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProfileImage(req, res) {
    try {
      const { NID, FID, profileImage } = req.body;
      const farm = await FarmService.updateProfileImage(NID, FID, profileImage);
      res.status(200).json({ message: "Profile image updated successfully", farm });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async addCertificate(req, res) {
    try {
      const { NID, FID, certificate } = req.body;
      const result = await FarmService.addCertificate(NID, FID, certificate);
      res.status(200).json({ message: "Certificate added successfully", certificate: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCertificate(req, res) {
    try {
      const { NID, FID, certificateID } = req.body;
      const result = await FarmService.deleteCertificate(NID, FID, certificateID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteFarm(req, res) {
    try {
      const { FID } = req.params;
      const { NID } = req.body;
      
      if (!NID) {
        return res.status(400).json({ error: "NID is required" });
      }

      const result = await FarmService.deleteFarm(NID, FID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FarmController;