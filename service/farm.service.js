const { Farm, User, Storage, Location } = require("../models");
const fs = require("fs");
const path = require("path");

class FarmService {
  static async getAllFarms() {
    const farms = await Farm.findAll({
      include: [
        { model: User, attributes: ["NID", "username", "type", "email", "phoneNumber"] },
        { model: Location, attributes: ["province", "district", "subDistrict"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
      ],
    });

    const formatted = farms.map((farm) => ({
      ...farm.toJSON(),
      storages: farm.Storages?.map((s) => `${s.typeStorage}:${s.file}`) || [],
    }));

    return formatted;
  }

  static async getFarm({ farmID, userNID }) {
    const where = {};

    if (farmID) where.FID = farmID;
    if (userNID) where.NID = userNID;

    const farms = await Farm.findAll({
      where,
      include: [
        { model: User, attributes: ["NID", "username", "email", "phoneNumber", "type"] },
        { model: Location, attributes: ["province", "district", "subDistrict"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
      ],
    });

    if (!farms || farms.length === 0) throw new Error("No farms found");

    return farms.map((farm) => {
      const farmData = farm.toJSON();
      return {
        ...farmData,
        storages: farmData.Storages?.map((s) => `${s.typeStorage}:${s.file}`) || [],
        Location: farmData.Location || {},
      };
    });
  }

  static async createFarm(userNID, data) {
      const user = await User.findByPk(userNID);
      if (!user) throw new Error("User not found");
      if (user.type !== "Farmer") throw new Error("Permission denied: Only farmers can create farms");

      const newFarm = await Farm.create({
        NID: userNID,
        farmName: data.farmName,
        line: data.line,
        facebook: data.facebook,
        email: data.email,
        phoneNumber: data.phoneNumber,
        description: data.description,
        locationID: data.locationID,
      });

      // ✅ จัดการ storages
      if (data.storages && Array.isArray(data.storages)) {
        for (const s of data.storages) {
          let fileData = s.file;

          // 🧩 ตรวจชนิดข้อมูลไฟล์
          if (Buffer.isBuffer(fileData)) {
            fileData = fileData.toString("base64");
          } else if (typeof fileData === "string") {
          if (fileData.startsWith("http")) {
            // เป็น URL — เก็บได้เลย
            } else if (!fileData.startsWith("data:")) {
              // เป็น path ไฟล์ — อ่านและแปลง base64
              const absPath = path.resolve(fileData);
              const fileBuffer = fs.readFileSync(absPath);
              fileData = fileBuffer.toString("base64");
            }
          }

          // 🧩 ตรวจชนิดไฟล์ (image หรือ video)
          let typeStorage = s.typeStorage || "image";
          if (
            fileData.startsWith("data:video") ||
            s.file.endsWith(".mp4") ||
            s.file.endsWith(".mov")
          ) {
            typeStorage = "video";
          }

          await Storage.create({
            FID: newFarm.FID,
            file: fileData,
            typeStorage,
          });
        }
      }

      return newFarm;
  }

  static async updateFarm(userNID, farmID, data) {
    const user = await User.findByPk(userNID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied: Only farmers can update farms");

    const farm = await Farm.findByPk(farmID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== userNID) throw new Error("You can only edit your own farm");

    // ✅ อัปเดตข้อมูลฟาร์มทั่วไป
    await farm.update({
      farmName: data.farmName || farm.farmName,
      line: data.line || farm.line,
      facebook: data.facebook || farm.facebook,
      email: data.email || farm.email,
      phoneNumber: data.phoneNumber || farm.phoneNumber,
      description: data.description || farm.description,
      locationID: data.locationID || farm.locationID,
    });

    // ✅ เพิ่มรูปหรือวิดีโอใหม่ (ไม่ลบของเดิม)
    if (data.storages && Array.isArray(data.storages)) {
      for (const s of data.storages) {
        let fileData = s.file;

        if (Buffer.isBuffer(fileData)) {
          fileData = fileData.toString("base64");
        } else if (typeof fileData === "string") {
          if (fileData.startsWith("http")) {
            // เป็น URL — เก็บได้เลย
          } else if (!fileData.startsWith("data:")) {
            const absPath = path.resolve(fileData);
            const fileBuffer = fs.readFileSync(absPath);
            fileData = fileBuffer.toString("base64");
          }
        }

        let typeStorage = s.typeStorage || "image";
        if (
          fileData.startsWith("data:video") ||
          s.file.endsWith(".mp4") ||
          s.file.endsWith(".mov")
        ) {
          typeStorage = "video";
        }

        await Storage.create({
          FID: farm.FID,
          file: fileData,
          typeStorage,
        });
      }
    }

    const updatedFarm = await Farm.findByPk(farmID, {
      include: [{ model: Storage, attributes: ["file", "typeStorage"] }],
    });

    return {
      ...updatedFarm.toJSON(),
      storages: updatedFarm.Storages.map((s) => `${s.typeStorage}:${s.file}`),
    };
  }
}

module.exports = FarmService;