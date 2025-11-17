"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Farm extends Model {
    static associate(models) {
      Farm.belongsTo(models.User, { foreignKey: "NID" });
      Farm.hasMany(models.Storage, { foreignKey: "FID" });
      Farm.hasMany(models.Product, { foreignKey: "FID" });
      Farm.hasMany(models.Chat, { foreignKey: "FID" });
      Farm.hasMany(models.Certificate, { foreignKey: "FID" });
    }
  }

  Farm.init(
    {
      FID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      NID: DataTypes.INTEGER,
      farmName: DataTypes.STRING,
      line: DataTypes.STRING,
      facebook: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      description: DataTypes.TEXT,
      lineToken: DataTypes.STRING||null,    // Channel Access Token (ของ OA)
      lineUserId: DataTypes.STRING||null,   // LINE userId ของเจ้าของฟาร์ม
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      subDistrict: DataTypes.STRING,
      location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Farm",
      tableName: "farms",
      timestamps: false,
    }
  );

  return Farm;
};