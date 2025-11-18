"use strict"

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            Booking.belongsTo(models.User, { foreignKey: "NID" });
            Booking.belongsTo(models.Farm, { foreignKey: "FID" });
        }
    }

    Booking.init(
        {
            BID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            NID: DataTypes.INTEGER,
            FID: DataTypes.INTEGER,
            date: DataTypes.DATE,
            time: DataTypes.TIME,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Booking",
            tableName: "bookings",
            timestamps: false,
        }   
    )    

    return Booking;
}