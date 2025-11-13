const { Sequelize } = require('sequelize');

let sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  sequelize = new Sequelize(
    'phaktae',//อย่าลืมลง sql ในเครื่องด้วยนะ
    'postgres',//ถ้าใช้ user อื่น อย่าลืมเปลี่ยน
    'suphakit25252523',//เปลี่ยนเป็นรหัสผ่านของตัวเอง
    {
      host: 'localhost',
      dialect: 'postgres'
    }
  );
}

module.exports = sequelize;