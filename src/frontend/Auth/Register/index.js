import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Register = ({ className }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    type: "Customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // กันค่าที่รับมาเหมือนหน้า Login → trimStart()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

const validateForm = () => {
  if (!formData.username.trim()) {
    setError("กรุณากรอกชื่อผู้ใช้");
    return false;
  }

  if (formData.username.length < 3) {
    setError("ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร");
    return false;
  }

  if (!formData.password) {
    setError("กรุณากรอกรหัสผ่าน");
    return false;
  }

  if (formData.password.length < 6) {
    setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    return false;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("รหัสผ่านไม่ตรงกัน");
    return false;
  }

  if (!formData.email.trim()) {
    setError("กรุณากรอกอีเมล");
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    setError("อีเมลไม่ถูกต้อง");
    return false;
  }

  if (!formData.phoneNumber.trim()) {
    setError("กรุณากรอกเบอร์โทรศัพท์");
    return false;
  }

  const cleanPhone = formData.phoneNumber.replace(/\D/g, "");
  if (!/^\d{10}$/.test(cleanPhone)) {
    setError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
    return false;
  }

  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post("http://localhost:4000/users/register", {
        username: formData.username,
        password: formData.password,
        type: formData.type === "Farmer",
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        line: null,
        facebook: null,
      });

      setSuccess("ลงทะเบียนสำเร็จ! กำลังเปลี่ยนไปยังหน้าเข้าสู่ระบบ...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "ลงทะเบียนล้มเหลว กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="register-left">
      <h1 className="logo">Phaktae</h1>
      </div>

      <div className="register-right">
        <h1 className="register-title">สร้างบัญชีใหม่</h1>

        <p className="register-subtitle">
          เข้าร่วมเราและเพลิดเพลินกับสิทธิพิเศษสำหรับสมาชิก
          รวมถึงสินค้าออแกนิคคุณภาพดี ราคาพิเศษ
          และประสบการณ์การช้อปผักสดที่ดีที่สุด
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Username + Type */}
          <div className="form-row">
            <div className="form-group">
              <label>ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="กรอกชื่อผู้ใช้"
                required
              />
            </div>

            <div className="form-group">
              <label>ประเภทบัญชี</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Customer">ลูกค้า</option>
                <option value="Farmer">เกษตรกร</option>
              </select>
            </div>
          </div>

          {/* Email + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label>อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="08XXXXXXXX"
                required
              />
            </div>
          </div>

          {/* Password */}
          <label className="register-label">รหัสผ่าน</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="register-input"
            placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>แสดงรหัสผ่าน</span>
          </div>

          {/* Confirm Password */}
          <label className="register-label">ยืนยันรหัสผ่าน</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className="register-input"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="show-password">
            <input
              type="checkbox"
              checked={showConfirmPassword}
              onChange={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            <span>แสดงรหัสผ่าน</span>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
          </button>
        </form>

        <div className="login-text">
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </div>
    </div>
  );
};

export default styled(Register)`
  display: flex;
  height: 90vh;
  background: #ffffff;
  overflow-y: auto;

  /* ----- LEFT SIDE (LINE Style) ----- */
  .register-left {
    width: 40%;
    min-width: 340px;
    border-right: 1px solid #e5e5e5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    background: #00b900;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .logo {
    font-size: 28px;
    font-weight: bold;
    color: #ffffffff;
    margin: 0;
    font-size: 114px;
  }

  /* ----- RIGHT SIDE ----- */
  .register-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 80px; /* ให้เท่ากับ login */

    @media (max-width: 768px) {
      padding: 40px 30px;
      max-width: 100%;
    }
  }

  .register-title {
    font-size: 28px;
    font-weight: 600;
    color: #111;
    margin-bottom: 10px;
    text-align: left;
  }

  .register-subtitle {
    font-size: 15px; /* ปรับจาก 14 → 15 เหมือน login */
    color: #666;
    margin-bottom: 24px;
    text-align: left;
    line-height: 1.5;
  }

  /* ----- FORM ----- */
  .register-form {
    display: flex;
    flex-direction: column;
  }

  .register-label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #333;
    text-align: left;
  }

  .register-input {
    padding: 12px 14px;
    font-size: 15px;
    border: 1px solid #dcdcdc;
    border-radius: 6px;
    background: #fafafa;
    margin-bottom: 16px; /* ทำให้ spacing เหมือน login */
    transition: 0.15s;
    text-align: left;

    &:focus {
      border-color: #06c755;
      background: #fff;
      outline: none;
    }

    &::placeholder {
      color: #999;
    }
  }

  /* Password + Confirm */
  .password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    .register-input {
      width: 100%;
      margin-bottom: 16px; /* ให้เว้นเหมือนฟอร์ม login */
    }
  }

  .toggle-password {
    position: absolute;
    right: 14px;
    font-size: 13px; /* เท่ากับ login */
    color: #06c755;
    cursor: pointer;
    user-select: none;
    font-weight: 500;

    &:hover {
      color: #006729ff;
    }
  }

  /* ----- BUTTON ----- */
  .register-button {
    padding: 12px;
    background: #06c755;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
    margin-bottom: 18px;
    margin-top: 8px;

    &:hover {
      background: #05b54c;
    }

    &:disabled {
      background: #a8eabb;
    }
  }

  .show-password {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    cursor: pointer;
    margin-top: -10px;
    margin-bottom: 16px;
  }

  .show-password span {
    user-select: none;
    color: #333;
  }

  /* ----- Error / Success ----- */
  .error-text {
    color: #e74c3c;
    font-size: 14px;
    text-align: center;
    margin-top: 16px;
  }

  .success-text {
    color: #27ae60;
    font-size: 14px;
    text-align: center;
    margin-top: 16px;
  }

  /* ==== FORM ROW (2 ช่องในบรรทัดเดียว) ==== */
  .form-row {
    display: flex;
    gap: 20px;
    width: 100%;
    margin-bottom: 16px;
  }

  /* กลุ่มของแต่ละช่อง */
  .form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* label ของแต่ละกลุ่ม */
  .form-group label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #333;
    text-align: left;
  }

  /* input + select style เดียวกับ register-input */
  .form-group input,
  .form-group select {
    padding: 12px 14px;
    font-size: 15px;
    border: 1px solid #dcdcdc;
    border-radius: 6px;
    background: #fafafa;
    transition: 0.15s;
    margin-bottom: 0;

    &:focus {
      border-color: #06c755;
      background: #fff;
      outline: none;
    }
  }

  /* Mobile — ให้เรียงลง */
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
    }
  }
`;
