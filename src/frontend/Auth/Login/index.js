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
              <a href="/forgot-password">ลืมรหัสผ่าน?</a>
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
`;
