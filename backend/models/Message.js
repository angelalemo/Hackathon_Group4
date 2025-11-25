"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Chat, { foreignKey: "logID" });
      Message.belongsTo(models.User, { foreignKey: "senderNID" });
    }
  }

  Message.init(
    {
      messageID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      logID: DataTypes.INTEGER,
      senderNID: DataTypes.INTEGER,
      messageText: DataTypes.TEXT,
      image: { type: DataTypes.TEXT, allowNull: true }, // Base64 image/file data
      fileType: { type: DataTypes.STRING, allowNull: true }, // 'image', 'file', 'video', etc.
      fileName: { type: DataTypes.STRING, allowNull: true }, // Original file name
      timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: false,
    }
  );

  return Message;
};
