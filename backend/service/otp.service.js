const { sendEmail } = require("./gmail.service");

// เก็บ OTP ใน memory (ใน production ควรใช้ Redis หรือ Database)
const otpStore = new Map();

// สร้าง OTP 6 หลัก
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// หมดอายุ OTP หลังจาก 10 นาที
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes

class OTPService {
  // ส่ง OTP ไปยังอีเมล
  static async sendOTP(email) {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error("อีเมลไม่ถูกต้อง");
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY;

    // เก็บ OTP
    otpStore.set(email, {
      otp,
      expiresAt,
      attempts: 0,
    });

    // ส่ง OTP ไปยังอีเมล
    const subject = "รหัสยืนยันอีเมล (OTP)";
    const body = `สวัสดีครับ/ค่ะ

รหัสยืนยันอีเมลของคุณคือ: ${otp}

รหัสนี้จะหมดอายุใน 10 นาที

หากคุณไม่ได้ขอรหัสนี้ กรุณาเพิกเฉยต่ออีเมลนี้

ขอบคุณครับ/ค่ะ`;

    try {
      const result = await sendEmail(email, subject, body);
      if (result.status === "error") {
        throw new Error(result.message);
      }
      return { success: true, message: "ส่ง OTP เรียบร้อยแล้ว" };
    } catch (error) {
      otpStore.delete(email);
      throw new Error("ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่");
    }
  }

  // ตรวจสอบ OTP
  static verifyOTP(email, inputOTP) {
    const stored = otpStore.get(email);

    if (!stored) {
      throw new Error("ไม่พบ OTP สำหรับอีเมลนี้ กรุณาขอ OTP ใหม่");
    }

    // ตรวจสอบว่า OTP หมดอายุหรือไม่
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      throw new Error("OTP หมดอายุแล้ว กรุณาขอ OTP ใหม่");
    }

    // ตรวจสอบจำนวนครั้งที่ลองผิด (จำกัด 5 ครั้ง)
    if (stored.attempts >= 5) {
      otpStore.delete(email);
      throw new Error("ลองผิดเกิน 5 ครั้ง กรุณาขอ OTP ใหม่");
    }

    // ตรวจสอบ OTP
    if (stored.otp !== inputOTP) {
      stored.attempts += 1;
      throw new Error(`OTP ไม่ถูกต้อง (เหลือ ${5 - stored.attempts} ครั้ง)`);
    }

    // OTP ถูกต้อง - ลบ OTP ออก
    otpStore.delete(email);
    return { success: true, message: "ยืนยัน OTP สำเร็จ" };
  }

  // ลบ OTP ที่หมดอายุ (cleanup function)
  static cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
      if (now > data.expiresAt) {
        otpStore.delete(email);
      }
    }
  }
}

// ทำความสะอาด OTP ที่หมดอายุทุก 5 นาที
setInterval(() => {
  OTPService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);

module.exports = OTPService;

