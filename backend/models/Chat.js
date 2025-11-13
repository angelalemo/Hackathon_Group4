"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User, { foreignKey: "NID" });
      Chat.belongsTo(models.Farm, { foreignKey: "FID" });
    }
  }

  Chat.init(
    {
      logID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      NID: DataTypes.INTEGER,
      FID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      timestamps: false,
    }
  );

  return Chat;
};