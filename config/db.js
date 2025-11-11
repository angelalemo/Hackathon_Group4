const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
     'Phaktae', // อันนี้อย่าลืมลง sql ชื่อเดียวกันก่อนรัน
     'postgres', // Username เปลี่ยนตามของตัวเอง อย่าลืม
     'GGwdst76', // Password เปลี่ยนตามของตัวเอง อย่าลืม
     {
       host: 'localhost',
       dialect: 'postgres' 
     }
   );

module.exports = sequelize;