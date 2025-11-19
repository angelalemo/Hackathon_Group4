import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Login = ({ className }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const sanitizeEmail = (value) => {
    return value.trim().toLowerCase();
  };

  const sanitizePassword = (value) => {
    return value.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ตรวจสอบรูปแบบอีเมล
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("อีเมลไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    // ⛔ กันค่าที่รับมาก่อนส่งไป backend
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = sanitizePassword(password);

    try {
      const response = await axios.post("http://localhost:4000/users/login", {
        email: cleanEmail,
        password: cleanPassword,
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>

      <div className="login-right">
        <h1 className="login-title">ยินดีต้อนรับกลับมา!</h1>

        <p className="login-subtitle">
          เข้าสู่ระบบหรือลงทะเบียน เพื่อเพลิดเพลินกับสิทธิพิเศษสำหรับสมาชิก
          ทั้งสินค้าออแกนิคคุณภาพดี ราคาพิเศษ
          และประสบการณ์การช้อปผักสดที่ดีที่สุดจากเกษตรกรโดยตรง
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">อีเมล</label>
          <input
            type="email"
            className="login-input"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
            required
          />

          <label className="login-label">รหัสผ่าน</label>
          <input
            type={showPassword ? "text" : "password"}
            className="login-input"
            placeholder="กรอกรหัสผ่านของคุณ"
            value={password}
            onChange={(e) => setPassword(sanitizePassword(e.target.value))}
            required
          />

          <div className="form-row">
            <div className="show-password">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>แสดงรหัสผ่าน</span>
            </div>

            <div className="forgot-password">
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
                setForgotStep(1);
                setForgotEmail("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                setForgotError("");
                setForgotSuccess("");
              }}>ลืมรหัสผ่าน?</a>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="register-text">
          ยังไม่มีบัญชี? <Link to="/register">ลงทะเบียนเลย!</Link>
        </div>

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="forgot-password-content">
            <button 
              className="close-modal-btn"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotStep(1);
                setForgotEmail("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                setForgotError("");
                setForgotSuccess("");
              }}
            >
              ✕
            </button>

            <h2>ลืมรหัสผ่าน</h2>

            {forgotStep === 1 && (
              <>
                <p className="forgot-description">กรุณากรอกอีเมลของคุณเพื่อรับ OTP</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotError("");
                  setForgotLoading(true);
                  try {
                    const response = await axios.post("http://localhost:4000/otp/send", {
                      email: forgotEmail.trim().toLowerCase()
                    });
                    setForgotSuccess(response.data.message || "ส่ง OTP เรียบร้อยแล้ว กรุณาตรวจสอบอีเมลของคุณ");
                    setForgotStep(2);
                  } catch (err) {
                    setForgotError(err.response?.data?.error || "เกิดข้อผิดพลาดในการส่ง OTP");
                  } finally {
                    setForgotLoading(false);
                  }
                }}>
                  <label className="login-label">อีเมล</label>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="example@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value.trim().toLowerCase())}
                    required
                  />
                  {forgotError && <p className="error-text">{forgotError}</p>}
                  {forgotSuccess && <p className="success-text">{forgotSuccess}</p>}
                  <button type="submit" className="login-button" disabled={forgotLoading}>
                    {forgotLoading ? "กำลังส่ง OTP..." : "ส่ง OTP"}
                  </button>
                </form>
              </>
            )}

            {forgotStep === 2 && (
              <>
                <p className="forgot-description">กรุณากรอก OTP ที่ส่งไปยังอีเมล: {forgotEmail}</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotError("");
                  setForgotLoading(true);
                  try {
                    const response = await axios.post("http://localhost:4000/otp/verify", {
                      email: forgotEmail.trim().toLowerCase(),
                      otp: otp.trim()
                    });
                    setForgotSuccess(response.data.message || "ยืนยัน OTP สำเร็จ");
                    setForgotStep(3);
                  } catch (err) {
                    setForgotError(err.response?.data?.error || "OTP ไม่ถูกต้อง");
                  } finally {
                    setForgotLoading(false);
                  }
                }}>
                  <label className="login-label">OTP</label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="กรอก OTP 6 หลัก"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    required
                  />
                  {forgotError && <p className="error-text">{forgotError}</p>}
                  {forgotSuccess && <p className="success-text">{forgotSuccess}</p>}
                  <button type="submit" className="login-button" disabled={forgotLoading}>
                    {forgotLoading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
                  </button>
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => {
                      setForgotStep(1);
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                    setForgotError("");
                    setForgotSuccess("");
                  }}
                >
                  ← กลับไปกรอกอีเมล
                </button>
                </form>
              </>
            )}

            {forgotStep === 3 && (
              <>
                <p className="forgot-description">กรุณากรอกรหัสผ่านใหม่</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotError("");
                  
                  if (newPassword.length < 6) {
                    setForgotError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
                    return;
                  }
                  
                  if (newPassword !== confirmPassword) {
                    setForgotError("รหัสผ่านไม่ตรงกัน");
                    return;
                  }

                  setForgotLoading(true);
                  try {
                    const response = await axios.post("http://localhost:4000/users/reset-password", {
                      email: forgotEmail.trim().toLowerCase(),
                      newPassword: newPassword.trim()
                    });
                    setForgotSuccess(response.data.message || "เปลี่ยนรหัสผ่านสำเร็จ");
                    setTimeout(() => {
                      setShowForgotPassword(false);
                      setForgotStep(1);
                      setForgotEmail("");
                      setOtp("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setShowNewPassword(false);
                      setShowConfirmPassword(false);
                      setForgotError("");
                      setForgotSuccess("");
                      alert("เปลี่ยนรหัสผ่านสำเร็จแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");
                    }, 2000);
                  } catch (err) {
                    setForgotError(err.response?.data?.error || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
                  } finally {
                    setForgotLoading(false);
                  }
                }}>
                  <label className="login-label">รหัสผ่านใหม่</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="login-input"
                      placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="show-password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  
                  <label className="login-label">ยืนยันรหัสผ่านใหม่</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="login-input"
                      placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="show-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  
                  {forgotError && <p className="error-text">{forgotError}</p>}
                  {forgotSuccess && <p className="success-text">{forgotSuccess}</p>}
                  <button type="submit" className="login-button" disabled={forgotLoading}>
                    {forgotLoading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default styled(Login)`
  display: flex;
  height: 90vh;
  background: #ffffff;

  /* ----- LEFT SIDE (LINE Style) ----- */
  .login-left {
    width: 40%;
    min-width: 340px;
    border-right: 1px solid #e5e5e5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    background: #00b900;
  }

  .logo {
    font-size: 28px;
    font-weight: bold;
    color: #ffffffff;
    margin: 0;
    font-size: 114px;
  }

  /* ----- RIGHT SIDE ----- */
  .login-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 80px;
  }

  .login-title {
    font-size: 28px;
    font-weight: 600;
    color: #111;
    margin-bottom: 10px;
    text-align: left; /* ✅ ชิดซ้าย */
  }

  .login-subtitle {
    font-size: 15px;
    color: #666;
    margin-bottom: 24px;
    text-align: left; /* ✅ ชิดซ้าย */
  }

  /* ----- FORM ----- */
  .login-form {
    display: flex;
    flex-direction: column;
  }

  .login-label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #333;
    text-align: left; /* ✅ ชิดซ้าย */
  }

  .login-input {
    padding: 12px 14px;
    font-size: 15px;
    border: 1px solid #dcdcdc;
    border-radius: 6px;
    background: #fafafa;
    margin-bottom: 16px;
    transition: 0.15s;
    text-align: left; /* ✅ ชิดซ้าย */

    &:focus {
      border-color: #06c755;
      background: #fff;
      outline: none;
      text-align: left; /* ✅ ชิดซ้าย */
    }
  }

  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }

  .show-password {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    cursor: pointer;
  }

  .forgot-password a {
    font-size: 14px;
    color: #06c755;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* ----- BUTTON ----- */
  .login-button {
    padding: 12px;
    background: #06c755; /* LINE GREEN */
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
    margin-bottom: 18px;

    &:hover {
      background: #05b54c;
    }

    &:disabled {
      background: #a8eabb;
    }
  }

  .register-text {
    text-align: center;
    color: #333;
    font-size: 15px;
    margin-top: 10px;

    span {
      color: #06c755;
      cursor: pointer;
    }
  }

  .error-text {
    color: #e74c3c;
    font-size: 14px;
    text-align: center;
    margin-top: 16px;
  }

  .success-text {
    color: #06c755;
    font-size: 14px;
    text-align: center;
    margin-top: 16px;
  }

  /* Forgot Password Modal */
  .forgot-password-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.3s ease;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }

  .forgot-password-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 100%;
    position: relative;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
    animation: slideUp 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    h2 {
      font-size: 26px;
      font-weight: 700;
      color: #111;
      margin-bottom: 12px;
      text-align: center;
      letter-spacing: -0.5px;
    }

    .forgot-description {
      font-size: 15px;
      color: #666;
      margin-bottom: 30px;
      text-align: center;
      line-height: 1.6;
    }

    .close-modal-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: #f5f5f5;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      padding: 8px 12px;
      line-height: 1;
      border-radius: 8px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;

      &:hover {
        background: #e5e5e5;
        color: #333;
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .back-button {
      width: 100%;
      padding: 12px 20px;
      background: #f8f9fa;
      color: #333;
      font-size: 15px;
      font-weight: 500;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &:hover {
        background: #e9ecef;
        border-color: #dee2e6;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .password-input-wrapper {
      position: relative;
      margin-bottom: 20px;

      .login-input {
        padding-right: 50px;
      }

      .show-password-toggle {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        padding: 6px;
        color: #999;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        border-radius: 6px;
        min-width: 32px;
        min-height: 32px;

        &:hover {
          color: #06c755;
          background: #f0fdf4;
          transform: translateY(-50%) scale(1.1);
        }

        &:active {
          transform: translateY(-50%) scale(0.95);
          opacity: 0.8;
        }
      }
    }

    form {
      .login-label {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #374151;
      }

      .login-input {
        padding: 14px 16px;
        font-size: 15px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        background: #fafafa;
        transition: all 0.2s;
        margin-bottom: 0;

        &:focus {
          border-color: #06c755;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(6, 199, 85, 0.1);
        }
      }

      .login-button {
        margin-top: 8px;
        padding: 14px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(6, 199, 85, 0.2);

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(6, 199, 85, 0.3);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }
    }
  }

  @media (max-width: 768px) {
    .forgot-password-modal {
      padding: 15px;
    }

    .forgot-password-content {
      padding: 30px 25px;
      max-width: 95%;
      border-radius: 16px;

      h2 {
        font-size: 22px;
        margin-bottom: 10px;
      }

      .forgot-description {
        font-size: 14px;
        margin-bottom: 25px;
      }

      .close-modal-btn {
        top: 15px;
        right: 15px;
        width: 32px;
        height: 32px;
        font-size: 18px;
        padding: 6px 10px;
      }

      form {
        .login-label {
          font-size: 13px;
          margin-bottom: 6px;
        }

        .login-input {
          padding: 12px 14px;
          font-size: 14px;
          border-radius: 8px;
        }

        .login-button {
          padding: 12px;
          font-size: 15px;
          border-radius: 8px;
        }
      }

      .back-button {
        padding: 10px 16px;
        font-size: 14px;
        margin-top: 10px;
      }

      .password-input-wrapper {
        margin-bottom: 18px;

        .show-password-toggle {
          right: 12px;
          font-size: 18px;
          min-width: 28px;
          min-height: 28px;
        }

        .login-input {
          padding-right: 45px;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .forgot-password-modal {
      padding: 10px;
    }

    .forgot-password-content {
      padding: 25px 20px;
      max-width: 100%;
      border-radius: 14px;
      max-height: 95vh;

      h2 {
        font-size: 20px;
        margin-bottom: 8px;
      }

      .forgot-description {
        font-size: 13px;
        margin-bottom: 20px;
        line-height: 1.5;
      }

      .close-modal-btn {
        top: 12px;
        right: 12px;
        width: 30px;
        height: 30px;
        font-size: 16px;
        padding: 5px 8px;
        border-radius: 6px;
      }

      form {
        .login-label {
          font-size: 12px;
          margin-bottom: 5px;
        }

        .login-input {
          padding: 11px 12px;
          font-size: 14px;
          border-width: 1.5px;
          border-radius: 8px;
        }

        .login-button {
          padding: 11px;
          font-size: 14px;
          margin-top: 6px;
        }
      }

      .back-button {
        padding: 10px 14px;
        font-size: 13px;
        margin-top: 8px;
        border-radius: 6px;
      }

      .password-input-wrapper {
        margin-bottom: 16px;

        .show-password-toggle {
          right: 10px;
          font-size: 16px;
          padding: 5px;
          min-width: 26px;
          min-height: 26px;
        }

        .login-input {
          padding-right: 42px;
        }
      }
    }
  }

  @media (max-width: 360px) {
    .forgot-password-content {
      padding: 20px 16px;

      h2 {
        font-size: 18px;
      }

      .forgot-description {
        font-size: 12px;
        margin-bottom: 18px;
      }

      .close-modal-btn {
        top: 10px;
        right: 10px;
        width: 28px;
        height: 28px;
        font-size: 14px;
      }

      form {
        .login-input {
          padding: 10px 12px;
          font-size: 13px;
        }

        .login-button {
          padding: 10px;
          font-size: 13px;
        }
      }
    }
  }
`;
