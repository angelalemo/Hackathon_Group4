"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.hasMany(models.Farm, { foreignKey: "locationID" });
    }
  }

  Location.init(
    {
      locationID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      subDistrict: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Location",
      tableName: "locations",
      timestamps: false,
    }
  );

  return Location;
};
