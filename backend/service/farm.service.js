const { Farm, User, Storage, Product, Certificate, Chat, Message } = require("../models");
const { Op } = require("sequelize");
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
        { model: Product, attributes: ["PID", "productName", "category", "saleType", "price", "image"] },
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
        { model: Product, attributes: ["PID", "productName", "category", "saleType", "price", "image"] },
      ],
    });

    const formatted = farms.map((farm) => {
      const data = farm.toJSON();

      return {
        ...data
      };
    });

    return formatted;
  }



  static async getFarmbyFarmID({FID}) {

    const farms = await Farm.findOne({
      where : { FID: FID },
      include: [
        { model: User, attributes: ["NID", "username", "email", "phoneNumber", "type"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
        { model: Certificate, attributes: ["institution", "file"] },
        { model: Product, attributes: ["PID", "productName", "category", "saleType", "price", "image"] },
      ],
    });

    return farms;

  }

  static async getFarmbyNID ({NID}) {
    const farms = await Farm.findOne({
      where: { NID },
      include: [
        { model: User, attributes: ["NID", "username", "email", "phoneNumber", "type"] },
        { model: Storage, attributes: ["file", "typeStorage"] },
        { model: Certificate, attributes: ["institution", "file"] },
        { model: Product, attributes: ["PID", "productName", "category", "saleType", "price", "image"] },
      ],
    });

    return farms;
  }

  static async createFarm(NID, data) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied: Only farmers can create farms");

    // ตรวจสอบข้อมูลบังคับ
    if (!data.farmName || !data.farmName.trim()) {
      throw new Error("กรุณากรอกชื่อฟาร์ม");
    }

    if (!data.email || !data.email.trim()) {
      throw new Error("กรุณากรอกอีเมล");
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      throw new Error("รูปแบบอีเมลไม่ถูกต้อง");
    }

    if (!data.phoneNumber || !data.phoneNumber.trim()) {
      throw new Error("กรุณากรอกเบอร์โทรศัพท์");
    }

    if (!data.location || !data.location.trim()) {
      throw new Error("กรุณากรอกที่อยู่");
    }

    if (!data.province || !data.province.trim()) {
      throw new Error("กรุณากรอกจังหวัด");
    }

    if (!data.district || !data.district.trim()) {
      throw new Error("กรุณากรอกอำเภอ/เขต");
    }

    if (!data.subDistrict || !data.subDistrict.trim()) {
      throw new Error("กรุณากรอกตำบล/แขวง");
    }

    // ตรวจสอบว่า certificates ต้องมีอย่างน้อย 1 ภาพ
    if (!Array.isArray(data.certificates) || data.certificates.length === 0) {
      throw new Error("กรุณาอัปโหลดใบรับรองอย่างน้อย 1 ภาพ");
    }

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
      profileImage: data.profileImage !== undefined ? data.profileImage : farm.profileImage,
    });

    return farm;
  }

  // อัปเดตรูปโปรไฟล์ฟาร์ม
  static async updateProfileImage(NID, FID, profileImage) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied");

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("You can only edit your own farm");

    // แปลง profileImage เป็น base64 ถ้าจำเป็น
    let imageData = profileImage;
    if (typeof profileImage === "string" && !profileImage.startsWith("data:") && !profileImage.startsWith("http")) {
      const abs = path.resolve(profileImage);
      const buf = fs.readFileSync(abs);
      imageData = buf.toString("base64");
    }

    await farm.update({ profileImage: imageData });
    return farm;
  }

  // เพิ่ม Certificate
  static async addCertificate(NID, FID, certificate) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied");

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("You can only edit your own farm");

    let certFile = certificate.file;
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

    const created = await Certificate.create({
      FID: farm.FID,
      institution: certificate.institution || "ใบรับรอง",
      file: certFile,
    });

    return created;
  }

  // ลบ Certificate
  static async deleteCertificate(NID, FID, certificateID) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied");

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("You can only edit your own farm");

    const certificate = await Certificate.findByPk(certificateID);
    if (!certificate) throw new Error("Certificate not found");
    if (certificate.FID !== FID) throw new Error("Certificate does not belong to this farm");

    await certificate.destroy();
    return { message: "Certificate deleted successfully" };
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

  // ลบฟาร์ม (เฉพาะเจ้าของฟาร์ม)
  static async deleteFarm(NID, FID) {
    const user = await User.findByPk(NID);
    if (!user) throw new Error("User not found");
    if (user.type !== "Farmer") throw new Error("Permission denied: Only farmers can delete farms");

    const farm = await Farm.findByPk(FID);
    if (!farm) throw new Error("Farm not found");
    if (farm.NID !== NID) throw new Error("Permission denied: You can only delete your own farm");

    // ลบข้อมูลที่เกี่ยวข้อง
    // ดึง Chat IDs ที่เกี่ยวข้องกับฟาร์ม
    const chats = await Chat.findAll({
      where: { FID: FID },
      attributes: ['logID']
    });
    const chatLogIDs = chats.map(chat => chat.logID);

    // ลบ Messages ที่เกี่ยวข้องกับ Chats ของฟาร์ม
    if (chatLogIDs.length > 0) {
      await Message.destroy({ where: { logID: { [Op.in]: chatLogIDs } } });
    }

    // ลบ Chats ที่เกี่ยวข้องกับฟาร์ม
    await Chat.destroy({ where: { FID: FID } });

    // ลบ Storage (ภาพ/วิดีโอ)
    await Storage.destroy({ where: { FID: FID } });

    // ลบ Certificate
    await Certificate.destroy({ where: { FID: FID } });

    // ลบ Product ที่เกี่ยวข้อง
    await Product.destroy({ where: { FID: FID } });

    // ลบฟาร์ม
    await farm.destroy();

    return { message: `Farm ${FID} deleted successfully` };
  }

}



module.exports = FarmService;