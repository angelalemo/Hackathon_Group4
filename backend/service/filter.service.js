// ...existing code...
const { Op } = require('sequelize');
const { Farm, Storage, User, Product } = require('../models');

/**
 * FilterService
 * อัปเดตใหม่หลัง province/district/subDistrict อยู่ใน farm แล้ว
 */
class FilterService {
  static buildFarmWhere(filters = {}) {
    const where = {};

    if (filters.farmName) {
      where.farmName = { [Op.iLike]: `%${filters.farmName}%` };
    }

    // -----------------------------
    // Location fields moved to Farm
    // -----------------------------
    if (filters.province) {
      where.province = { [Op.iLike]: `%${filters.province}%` };
    }
    if (filters.district) {
      where.district = { [Op.iLike]: `%${filters.district}%` };
    }
    if (filters.subDistrict) {
      where.subDistrict = { [Op.iLike]: `%${filters.subDistrict}%` };
    }

    return where;
  }

  static buildIncludes(filters = {}) {
    const includes = [];

    // Storage
    includes.push({ model: Storage, required: false });

    // Product filtering
    const prodWhere = {};
    if (filters.productName) prodWhere.productName = { [Op.iLike]: `%${filters.productName}%` };
    if (filters.productCategory) prodWhere.category = { [Op.iLike]: `%${filters.productCategory}%` };

    if (Object.keys(prodWhere).length > 0) {
      includes.push({ model: Product, required: true, where: prodWhere });
    } else {
      includes.push({ model: Product, required: false });
    }

    // User (owner)
    const userWhere = {};
    if (filters.shopName) {
      userWhere.username = { [Op.iLike]: `%${filters.shopName}%` };
    }

    if (Object.keys(userWhere).length > 0) {
      includes.push({
        model: User,
        required: true,
        where: userWhere,
        attributes: ['NID', 'username', 'type'],
      });
    } else {
      includes.push({
        model: User,
        required: false,
        attributes: ['NID', 'username', 'type'],
      });
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
   * opts: { productName, productCategory, province, district, subDistrict,
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

      // Storages
      farm.storages = (farm.Storages || []).map(s => ({
        type: s.typeStorage,
        file: s.file
      }));
      delete farm.Storages;

      // User
      if (farm.User) {
        farm.owner = {
          NID: farm.User.NID,
          username: farm.User.username,
          type: farm.User.type,
        };
        delete farm.User;
      }

      // Products
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
