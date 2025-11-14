"use strict"
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    static associate(models) {
      Certificate.belongsTo(models.Farm, { foreignKey: "FID" });
    }
  }

  Certificate.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      FID: DataTypes.INTEGER,
      institution: DataTypes.STRING,
      file: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Certificate",
      tableName: "certificates",
      timestamps: false,
    }
  );

  return Certificate;
};