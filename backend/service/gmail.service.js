require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, body) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: 'success', message: 'อีเมลถูกส่งเรียบร้อยแล้ว' };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'ไม่สามารถส่งอีเมลได้' };
  }
}

module.exports = { sendEmail };
