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
