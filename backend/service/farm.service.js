const { Farm, User, Storage, Location, Certificate } = require("../models");
const fs = require("fs");
const path = require("path");

class FarmService {
  static async getAllFarms() {
    const farms = await Farm.findAll({
      include: [
        { model: User, attributes: ["NID", "username", "type", "email", "phoneNumber"] },
        { model: Location, attributes: ["province", "district", "subDistrict"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
        { model: Certificate, attributes: ["institution", "file"] }
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
        { model: Certificate, attributes: ["institution", "file"] },
      ],
    });

    if (!farms || farms.length === 0) throw new Error("No farms found");

    return farms.map((farm) => {
      const farmData = farm.toJSON();
      return {
        ...farmData,
        storages: farmData.Storages?.map((s) => `${s.typeStorage}:${s.file}`) || [],
        certificates: farmData.Certificates?.map((c) => ({
          institution: c.institution,
          file: c.file,
        })) || [],
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
      lineToken: data.lineToken,
      lineUserId: data.lineUserId,
    });

    // ✅ จัดการ storages (รูป / วิดีโอ)
    if (data.storages && Array.isArray(data.storages)) {
      for (const s of data.storages) {
        let fileData = s.file;

        if (Buffer.isBuffer(fileData)) {
          fileData = fileData.toString("base64");
        } else if (typeof fileData === "string") {
          if (fileData.startsWith("http")) {
            // URL — ใช้ได้เลย
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
          FID: newFarm.FID,
          file: fileData,
          typeStorage,
        });
      }
    }

    // ✅ จัดการ certificates (ใบรับรอง)
    if (data.certificates && Array.isArray(data.certificates)) {
      for (const c of data.certificates) {
        let certFile = c.file;

        if (Buffer.isBuffer(certFile)) {
          certFile = certFile.toString("base64");
        } else if (typeof certFile === "string") {
          if (certFile.startsWith("http")) {
            // เป็น URL — ใช้ได้เลย
          } else if (!certFile.startsWith("data:")) {
            const absPath = path.resolve(certFile);
            const fileBuffer = fs.readFileSync(absPath);
            certFile = fileBuffer.toString("base64");
          }
        }

        await Certificate.create({
          FID: newFarm.FID,
          institution: c.institution,
          file: certFile,
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

    const lineToken = "DteoCpKEmdM0Vtq7yyh+/AdMilxXVkzftFhOw366/S9kDUBR6BaqS2+clUFvgKLI93fLmya0pWLyHzamMh02Lq84T3zRXrvvITvJPO1Rn16tlN88/SKktwF0yrDUq3xBXf4jjgpSL7DTfYxo/ZYcCgdB04t89/1O/w1cDnyilFU="; // ตัวอย่าง token ใหม่

    // ✅ อัปเดตข้อมูลฟาร์มทั่วไป
    await farm.update({
      farmName: data.farmName || farm.farmName,
      line: data.line || farm.line,
      facebook: data.facebook || farm.facebook,
      email: data.email || farm.email,
      phoneNumber: data.phoneNumber || farm.phoneNumber,
      description: data.description || farm.description,
      locationID: data.locationID || farm.locationID,
      lineToken: data.lineToken || farm.lineToken,
      lineUserId: data.lineUserId || farm.lineUserId,
    });

    // ✅ เพิ่ม storages ใหม่ (ไม่ลบของเดิม)
    if (data.storages && Array.isArray(data.storages)) {
      for (const s of data.storages) {
        let fileData = s.file;

        if (Buffer.isBuffer(fileData)) {
          fileData = fileData.toString("base64");
        } else if (typeof fileData === "string") {
          if (fileData.startsWith("http")) {
            // URL — ใช้ได้เลย
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

    // ✅ เพิ่มใบรับรองใหม่ (ไม่ลบของเดิม)
    if (data.certificates && Array.isArray(data.certificates)) {
      for (const c of data.certificates) {
        let certFile = c.file;

        if (Buffer.isBuffer(certFile)) {
          certFile = certFile.toString("base64");
        } else if (typeof certFile === "string") {
          if (certFile.startsWith("http")) {
            // URL — ใช้ได้เลย
          } else if (!certFile.startsWith("data:")) {
            const absPath = path.resolve(certFile);
            const fileBuffer = fs.readFileSync(absPath);
            certFile = fileBuffer.toString("base64");
          }
        }

        await Certificate.create({
          FID: farm.FID,
          institution: c.institution,
          file: certFile,
        });
      }
    }

    // ✅ โหลดข้อมูลฟาร์มใหม่ (รวม Storage + Certificate)
    const updatedFarm = await Farm.findByPk(farmID, {
      include: [
        { model: Storage, attributes: ["file", "typeStorage"] },
        { model: Certificate, attributes: ["institution", "file"] },
      ],
    });

    return {
      ...updatedFarm.toJSON(),
      storages: updatedFarm.Storages.map((s) => `${s.typeStorage}:${s.file}`),
      certificates: updatedFarm.Certificates.map((c) => ({
        institution: c.institution,
        file: c.file,
      })),
    };
  }

}



module.exports = FarmService;