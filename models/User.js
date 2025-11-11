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
      line: DataTypes.STRING,
      facebook: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
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
