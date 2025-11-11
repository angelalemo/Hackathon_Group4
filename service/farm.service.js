const { Farm, User, Storage, Location } = require("../models");

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

    if (data.storages && Array.isArray(data.storages)) {
      for (const s of data.storages) {
        await Storage.create({
          FID: newFarm.FID,
          file: s.file.toString(), // แปลงเป็น string
          typeStorage: s.typeStorage,
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

  // อัปเดตข้อมูลฟาร์มทั่วไป
  await farm.update({
    farmName: data.farmName || farm.farmName,
    line: data.line || farm.line,
    facebook: data.facebook || farm.facebook,
    email: data.email || farm.email,
    phoneNumber: data.phoneNumber || farm.phoneNumber,
    description: data.description || farm.description,
    locationID: data.locationID || farm.locationID,
  });

  // ถ้ามีไฟล์ใหม่เพิ่มเข้ามา (เช่น รูป/วิดีโอ)
  if (data.storages && Array.isArray(data.storages)) {
    for (const s of data.storages) {
      await Storage.create({
        FID: farm.FID,
        file: s.file.toString(),     
        typeStorage: s.typeStorage,  
      });
    }
  }

  // โหลดข้อมูลใหม่ (รวม Storage ทั้งหมด)
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