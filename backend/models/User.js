"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Farm, { foreignKey: "NID" });
      User.hasMany(models.Chat, { foreignKey: "NID" });
    }
  }

  User.init(
    {
      NID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      type: DataTypes.STRING, // 'Farmer' หรือ 'Customer'
      line: DataTypes.STRING||null,
      facebook: DataTypes.STRING||null,
      email: DataTypes.STRING||null,
      phoneNumber: DataTypes.STRING,
      ProfileImage: DataTypes.TEXT||null,
      
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};
