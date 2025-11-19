const OTPService = require("../service/otp.service");

class OTPController {
  // ส่ง OTP ไปยังอีเมล
  static async sendOTP(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "กรุณากรอกอีเมล" });
      }

      const result = await OTPService.sendOTP(email);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // ยืนยัน OTP
  static async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ error: "กรุณากรอกอีเมลและ OTP" });
      }

      const result = await OTPService.verifyOTP(email, otp);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OTPController;

