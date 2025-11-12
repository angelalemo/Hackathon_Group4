"use strict"
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Storage extends Model {
    static associate(models) {
      Storage.belongsTo(models.Farm, { foreignKey: "FID" });
    }
  }

  Storage.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      FID: DataTypes.INTEGER,
      file: DataTypes.STRING,
      typeStorage: DataTypes.STRING, // image หรือ video
    },
    {
      sequelize,
      modelName: "Storage",
      tableName: "storages",
      timestamps: false,
    }
  );

  return Storage;
};