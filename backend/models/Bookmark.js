"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    static associate(models) {
      Bookmark.belongsTo(models.User, { foreignKey: "NID" });
      Bookmark.belongsTo(models.Product, { foreignKey: "PID" });
    }
  }

  Bookmark.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      NID: { type: DataTypes.INTEGER, allowNull: false },
      PID: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Bookmark",
      tableName: "bookmarks",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["NID", "PID"],
        },
      ],
    }
  );

  return Bookmark;
};

