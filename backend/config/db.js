const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
     'phaktae', // อันนี้อย่าลืมลง sql ชื่อเดียวกันก่อนรัน
     'postgres', // Username เปลี่ยนตามของตัวเอง อย่าลืม
     'M12345', // Password เปลี่ยนตามของตัวเอง อย่าลืม
     {
       host: 'localhost',
       dialect: 'postgres' 
     }
   );

module.exports = sequelize;