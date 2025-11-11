"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Farm extends Model {
    static associate(models) {
      Farm.belongsTo(models.User, { foreignKey: "NID" });
      Farm.belongsTo(models.Location, { foreignKey: "locationID" });
      Farm.hasMany(models.Storage, { foreignKey: "FID" });
      Farm.hasMany(models.Product, { foreignKey: "FID" });
      Farm.hasMany(models.Chat, { foreignKey: "FID" });
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
      locationID: DataTypes.INTEGER,
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