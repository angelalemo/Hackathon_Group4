const { sendEmail } = require('../service/gmail.service');
async function sendEmailController(req, res) {
  const {to} = req.body;
    const subject = 'การแจ้งเตือนจากระบบฟาร์มของคุณ';
    const body = 'มีลูกค้าแสดงความสนใจในสินค้าของคุณ กรุณาตรวจสอบระบบเพื่อดูรายละเอียดเพิ่มเติม.';

  if (!to) {
    return res.status(400).json({ status: 'error', message: 'ไม่ได้ระบุผู้รับ' });
  }

  const result = await sendEmail(to, subject, body);
  if (result.status === 'success') {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}

module.exports = { sendEmailController };