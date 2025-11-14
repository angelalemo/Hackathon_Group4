// ...existing code...
const { Op } = require('sequelize');
const { Farm, Storage, Location, User, Product } = require('../models');

/**
 * FilterService
 * ใช้ class แบบเดียวกับ product.service.js
 * รองรับ filters:
 * - productName (ผักชื่อที่พิมพ์)
 * - productCategory (ชนิดผักที่เลือก)
 * - locationID / province / district / subDistrict
 * - farmName (ชื่อฟาร์มที่พิมพ์)
 * - shopName (ชื่อร้านค้าที่พิมพ์ => User.username)
 * ฝ-0 page, limit, sortBy
 */
class FilterService {
  static buildFarmWhere(filters = {}) {
    const where = {};
    if (filters.farmName) {
      where.farmName = { [Op.iLike]: `%${filters.farmName}%` };
    }
    // เพิ่ม field อื่นได้ตามต้องการ
    return where;
  }

  static buildIncludes(filters = {}) {
    const includes = [];

    // Storages (ไม่ใช่ตัวกรอง แต่ใช้ส่งกลับไฟล์)
    includes.push({ model: Storage, required: false });

    // Location (ถ้ามีเงื่อนไข ให้เป็น required เพื่อกรอง)
    const locWhere = {};
    if (filters.locationID) locWhere.locationID = filters.locationID;
    if (filters.province) locWhere.province = { [Op.iLike]: `%${filters.province}%` };
    if (filters.district) locWhere.district = { [Op.iLike]: `%${filters.district}%` };
    if (filters.subDistrict) locWhere.subDistrict = { [Op.iLike]: `%${filters.subDistrict}%` };

    if (Object.keys(locWhere).length > 0) {
      includes.push({ model: Location, required: true, where: locWhere });
    } else {
      includes.push({ model: Location, required: false });
    }

    // Product (ใช้กรองตามชื่อหรือหมวดหมู่)
    const prodWhere = {};
    if (filters.productName) prodWhere.productName = { [Op.iLike]: `%${filters.productName}%` };
    if (filters.productCategory) prodWhere.category = { [Op.iLike]: `%${filters.productCategory}%` };

    if (Object.keys(prodWhere).length > 0) {
      includes.push({ model: Product, required: true, where: prodWhere });
    } else {
      includes.push({ model: Product, required: false });
    }

    // User (owner) - กรองตาม shopName => User.username
    const userWhere = {};
    if (filters.shopName) userWhere.username = { [Op.iLike]: `%${filters.shopName}%` };

    if (Object.keys(userWhere).length > 0) {
      includes.push({ model: User, required: true, where: userWhere, attributes: ['NID', 'username', 'type'] });
    } else {
      includes.push({ model: User, required: false, attributes: ['NID', 'username', 'type'] });
    }

    return includes;
  }

  static parseSort(sortBy) {
    if (!sortBy) return [['createdAt', 'DESC']];
    const [field, dir] = sortBy.split(':');
    const direction = dir && dir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    return [[field, direction]];
  }

  /**
   * opts: { productName, productCategory, locationID, province, district, subDistrict,
   *         farmName, shopName, page, limit, sortBy }
   */
  static async filterFarms(opts = {}) {
    const page = Math.max(1, parseInt(opts.page || 1, 10));
    const limit = Math.max(1, parseInt(opts.limit || 20, 10));
    const offset = (page - 1) * limit;
    const order = this.parseSort(opts.sortBy);

    const where = this.buildFarmWhere(opts);
    const include = this.buildIncludes(opts);

    const { rows, count } = await Farm.findAndCountAll({
      where,
      include,
      distinct: true,
      limit,
      offset,
      order,
    });

    const data = rows.map((r) => {
      const farm = r.toJSON ? r.toJSON() : r;

      // Storages -> storages summary
      farm.storages = (farm.Storages || []).map(s => ({ type: s.typeStorage, file: s.file }));
      delete farm.Storages;

      // Location -> location object
      if (farm.Location) {
        farm.location = {
          locationID: farm.Location.locationID,
          province: farm.Location.province,
          district: farm.Location.district,
          subDistrict: farm.Location.subDistrict,
        };
        delete farm.Location;
      }

      // User -> owner
      if (farm.User) {
        farm.owner = {
          NID: farm.User.NID,
          username: farm.User.username,
          type: farm.User.type,
        };
        delete farm.User;
      }

      // Products -> products list
      farm.products = (farm.Products || []).map(p => ({
        PID: p.PID,
        productName: p.productName,
        category: p.category,
        saleType: p.saleType,
        price: p.price,
        image: p.image,
      }));
      delete farm.Products;

      return farm;
    });

    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = FilterService;
// ...existing code...