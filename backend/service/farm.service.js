const { Farm, User, Storage, Certificate } = require("../models");
const fs = require("fs");
const path = require("path");

class FarmService {

    static async getFarmWithProducts(FID) {
    const farm = await Farm.findOne({
      where: { FID: FID },
      include: [
        {
          model: Product,
          as: "Products",
        },
      ],
    });
    return farm;
  }

  // ดึงฟาร์มทั้งหมดพร้อมสินค้า
  static async getAllFarmsWithProducts() {
    const farms = await Farm.findAll({
      include: [
        {
          model: Product,
          as: "Products",
        },
      ],
    });
    return farms;
  }
  
  static async getAllFarms() {
    const farms = await Farm.findAll({
      include: [
        { model: User, attributes: ["NID", "username", "type", "email", "phoneNumber"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
        { model: Certificate, attributes: ["institution", "file"] },
      ],
    });

    const formatted = farms.map((farm) => {
      const data = farm.toJSON();

      return {
        ...data,

        // ⚡ storages
        storages: data.Storages?.map((s) => `${s.typeStorage}:${s.file}`) || [],

        // ⚡ certificates
        certificates: data.Certificates?.map((c) => ({
          institution: c.institution,
          file: c.file,
        })) || [],

        // ⚡ location fields (ดึงจาก Farm โดยตรง)
        location: {
          province: data.province,
          district: data.district,
          subDistrict: data.subDistrict,
        },
      };
    });

    return formatted;
  }



  static async getFarmbyFarmID({FID}) {

    const farms = await Farm.findAll({
      where : { FID: FID },
      include: [
        { model: User, attributes: ["NID", "username", "email", "phoneNumber", "type"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
        { model: Certificate, attributes: ["institution", "file"] },
      ],
    });

    if (!farms || farms.length === 0) throw new Error("No farms found");

    return farms.map((farm) => {
      const data = farm.toJSON();

      return {
        ...data,

        // ⚡ storages
        storages: data.Storages?.map((s) => `${s.typeStorage}:${s.file}`) || [],

        // ⚡ certificates
        certificates: data.Certificates?.map((c) => ({
          institution: c.institution,
          file: c.file,
        })) || [],

        // ⚡ location จาก Farm model
        location: {
          province: data.province,
          district: data.district,
          subDistrict: data.subDistrict,
        },
      };
    });
  }

  static async getFarmbyNID ({NID}) {
    const farms = await Farm.findAll({
      where: { NID },
      include: [
        { model: User, attributes: ["NID", "username", "email", "phoneNumber", "type"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
        { model: Certificate, attributes: ["institution", "file"] },
      ],
    });

    if (!farms || farms.length === 0) throw new Error("No farms found");

    return farms.map((farm) => {
      const data = farm.toJSON();

      return {
        ...data,

        // ⚡ storages
        storages: data.Storages?.map((s) => `${s.typeStorage}:${s.file}`) || [],

        // ⚡ certificates
        certificates: data.Certificates?.map((c) => ({
          institution: c.institution,
          file: c.file,
        })) || [],

        // ⚡ location จาก Farm model
        location: {
          province: data.province,
          district: data.district,
          subDistrict: data.subDistrict,
        },
      };
    });
  }

  static async createFarm(NID, data) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied: Only farmers can create farms");

    // 🟦 สร้างฟาร์ม
    const newFarm = await Farm.create({
      NID: NID,
      farmName: data.farmName,
      line: data.line,
      facebook: data.facebook,
      email: data.email,
      phoneNumber: data.phoneNumber,
      description: data.description,
      lineToken: data.lineToken,
      lineUserId: data.lineUserId,
      province: data.province,
      district: data.district,
      subDistrict: data.subDistrict,
      location: data.location,
    });

    // 🟩 จัดการ Storage (ภาพ/วิดีโอหลายไฟล์)
    if (Array.isArray(data.storages)) {
      for (const s of data.storages) {
        let fileData = s.file;

        // 🔹 Buffer → Base64
        if (Buffer.isBuffer(fileData)) {
          fileData = fileData.toString("base64");
        }

        // 🔹 Path → Base64
        else if (typeof fileData === "string") {
          if (fileData.startsWith("http")) {
            // URL ใช้ได้เลย
          } else if (!fileData.startsWith("data:")) {
            const abs = path.resolve(fileData);
            const buf = fs.readFileSync(abs);
            fileData = buf.toString("base64");
          }
        }

        // ตรวจประเภทไฟล์
        let typeStorage = "image";

        // base64 ของ video จะขึ้น "data:video"
        if (typeof fileData === "string") {
          if (fileData.startsWith("data:video")) typeStorage = "video";
        }

        // ไฟล์ URL → ดูนามสกุล
        if (typeof s.file === "string") {
          if (s.file.endsWith(".mp4") || s.file.endsWith(".mov")) {
            typeStorage = "video";
          }
        }

        await Storage.create({
          FID: newFarm.FID,
          file: fileData,
          typeStorage,
        });
      }
    }

    // 🟧 จัดการ Certificate (หลายไฟล์)
    if (Array.isArray(data.certificates)) {
      for (const c of data.certificates) {
        let certFile = c.file;

        if (Buffer.isBuffer(certFile)) {
          certFile = certFile.toString("base64");
        } else if (typeof certFile === "string") {
          if (certFile.startsWith("http")) {
            // URL ใช้ได้เลย
          } else if (!certFile.startsWith("data:")) {
            const abs = path.resolve(certFile);
            const buf = fs.readFileSync(abs);
            certFile = buf.toString("base64");
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

  static async updateFarmInfo(NID, FID, data) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied");

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("You can only edit your own farm");

    await farm.update({
      farmName: data.farmName ?? farm.farmName,
      line: data.line ?? farm.line,
      facebook: data.facebook ?? farm.facebook,
      email: data.email ?? farm.email,
      phoneNumber: data.phoneNumber ?? farm.phoneNumber,
      description: data.description ?? farm.description,
      locationID: data.locationID ?? farm.locationID,
      lineToken: data.lineToken ?? farm.lineToken,
      lineUserId: data.lineUserId ?? farm.lineUserId,
      province: data.province ?? farm.province,
      district: data.district ?? farm.district,
      subDistrict: data.subDistrict ?? farm.subDistrict,
      location: data.location ?? farm.location,
    });

    return farm;
  }

  static async addStorage(NID, FID, storages) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied");

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("You can only edit your own farm");

    const results = [];

    for (const s of storages) {
      let fileData = s.file;

      if (Buffer.isBuffer(fileData)) {
        fileData = fileData.toString("base64");
      } else if (typeof fileData === "string") {
        if (!fileData.startsWith("http") && !fileData.startsWith("data:")) {
          const absPath = path.resolve(fileData);
          fileData = fs.readFileSync(absPath).toString("base64");
        }
      }

      let type = "image";
      if (
        fileData.startsWith("data:video") ||
        (typeof s.file === "string" && (s.file.endsWith(".mp4") || s.file.endsWith(".mov")))
      ) {
        type = "video";
      }

      const created = await Storage.create({
        FID: farm.FID,
        file: fileData,
        typeStorage: type,
      });

      results.push(created);
    }

    return results;
  }
    static async deleteStorage(NID, FID, storageID) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied");

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("You can only edit your own farm");

    const storage = await Storage.findByPk(storageID);

    if (!storage) throw new Error("Storage not found");

    
    if (storage.FID !== FID)
      throw new Error("Storage does not belong to this farm");

    const farmOfStorage = await Farm.findByPk(storage.FID);
    if (farmOfStorage.NID !== NID)
      throw new Error("You can delete only your own storage");

    await storage.destroy();

    return { message: "Storage deleted successfully" };
  }

}



module.exports = FarmService;