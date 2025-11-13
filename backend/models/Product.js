"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Farm, { foreignKey: "FID" });
    }
  }

  Product.init(
    {
      PID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      FID: DataTypes.INTEGER,
      productName: DataTypes.STRING,
      category: DataTypes.STRING,
      saleType: DataTypes.STRING,
      price: DataTypes.FLOAT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: false,
    }
  );

  return Product;
};