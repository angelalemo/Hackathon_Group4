import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Createfarm = ({ className }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const farmerNID = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).NID : "";

  const [form, setForm] = useState({
    NID: farmerNID,
    farmName: "",
    line: "",
    facebook: "",
    email: "",
    phoneNumber: "",
    description: "",
    location: "",
    province: "",
    district: "",
    subDistrict: "",
    storages: [],
    certificates: [],
  });

  // เช็คฟาร์มก่อน
  useEffect(() => {
    const checkFarm = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/farms/user/${farmerNID}`);
        if (res.data) {
          navigate("/farms");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    checkFarm();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const toBase64Image = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      // ถ้าไม่ใช่ภาพ ส่งเป็น base64 ปกติ
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // ย่อขนาดตามสัดส่วน
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

const handleStorageUpload = async (e) => {
  const files = Array.from(e.target.files);
  const base64List = await Promise.all(
    files.map(async (file) => ({
      file: await toBase64Image(file),
      typeStorage: "image",
    }))
  );
  setForm((prev) => ({
    ...prev,
    storages: [...prev.storages, ...base64List],
  }));
};

const handleCertificateUpload = async (e) => {
  const files = Array.from(e.target.files);
  const base64List = await Promise.all(
    files.map(async (file) => ({
      institution: "Unknown",
      file: await toBase64Image(file),
    }))
  );
  setForm((prev) => ({
    ...prev,
    certificates: [...prev.certificates, ...base64List],
  }));
};

  const removeStorage = (index) => {
    setForm((prev) => ({
      ...prev,
      storages: prev.storages.filter((_, i) => i !== index),
    }));
  };

  const removeCertificate = (index) => {
    setForm((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/farms/create", form);
      alert("สร้างฟาร์มสำเร็จ!");
      navigate("/farms");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการสร้างฟาร์ม");
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>กำลังตรวจสอบข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="container">
        <div className="header">
          <div className="icon">🌾</div>
          <h1>สร้างฟาร์มของคุณ</h1>
          <p className="subtitle">กรอกข้อมูลฟาร์มเพื่อเริ่มต้นการใช้งาน</p>
        </div>

        <form onSubmit={handleSubmit} className="form-box">
          {/* ข้อมูลพื้นฐาน */}
          <div className="section">
            <h3 className="section-title">
              <span className="section-icon">📋</span>
              ข้อมูลพื้นฐาน
            </h3>
            
            <div className="input-group">
              <label>ชื่อฟาร์ม *</label>
              <input 
                name="farmName" 
                value={form.farmName} 
                onChange={handleChange} 
                placeholder="เช่น ฟาร์มสุขใจ"
                required 
              />
            </div>

            <div className="input-group">
              <label>รายละเอียดฟาร์ม</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange}
                placeholder="บอกเล่าเกี่ยวกับฟาร์มของคุณ..."
                rows="4"
              />
            </div>

            <div className="section">
              <h3 className="section-title">
                <span className="section-icon">📍</span
                >ที่อยู่ฟาร์ม</h3>
              <div className="grid-2">
                <div className="input-group">
                  <label>ที่อยู่</label>
                  <input 
                    name="location" 
                    value={form.location} 
                    onChange={handleChange}
                    placeholder="เช่น 123 หมู่ 4 "
                  />
                </div>
            
                <div className="input-group">
                  <label>ตำบล/แขวง</label>
                  <input 
                    name="subDistrict" 
                    value={form.subDistrict} 
                    onChange={handleChange}
                    placeholder="เช่น บางรัก"
                  />
                </div>

                <div className="input-group">
                  <label>อำเภอ/เขต</label>
                  <input 
                    name="district" 
                    value={form.district} 
                    onChange={handleChange}
                    placeholder="เช่น เมือง"
                  />
                </div>

                <div className="input-group">
                  <label>จังหวัด</label>
                  <input 
                    name="province" 
                    value={form.province} 
                    onChange={handleChange}
                    placeholder="เช่น กรุงเทพมหานคร"
                  />
                </div>

              </div>

              
            </div>
              
              
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="section">
            <h3 className="section-title">
              <span className="section-icon">📞</span>
              ช่องทางติดต่อ
            </h3>
            
            <div className="grid-2">
              <div className="input-group">
                <label>เบอร์โทรศัพท์</label>
                <input 
                  name="phoneNumber" 
                  value={form.phoneNumber} 
                  onChange={handleChange}
                  placeholder="0XX-XXX-XXXX"
                />
              </div>

              <div className="input-group">
                <label>อีเมล</label>
                <input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>

              <div className="input-group">
                <label>LINE ID</label>
                <input 
                  name="line" 
                  value={form.line} 
                  onChange={handleChange}
                  placeholder="@yourline"
                />
              </div>

              <div className="input-group">
                <label>Facebook</label>
                <input 
                  name="facebook" 
                  value={form.facebook} 
                  onChange={handleChange}
                  placeholder="facebook.com/yourpage"
                />
              </div>
            </div>
          </div>

          {/* รูปภาพฟาร์ม */}
          <div className="section">
            <h3 className="section-title">
              <span className="section-icon">📸</span>
              รูปภาพฟาร์ม
            </h3>
            
            <div className="upload-area">
              <input 
                type="file" 
                id="storage-upload"
                accept="image/*" 
                multiple 
                onChange={handleStorageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="storage-upload" className="upload-label">
                <div className="upload-icon">📷</div>
                <span>คลิกเพื่ออัปโหลดรูปภาพ</span>
                <small>รองรับไฟล์ JPG, PNG (สูงสุด 5MB)</small>
              </label>
            </div>

            {form.storages.length > 0 && (
              <div className="preview-box">
                {form.storages.map((s, i) => (
                  <div key={i} className="preview-item">
                    <img src={s.file} alt="preview" className="preview-img" />
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removeStorage(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ใบรับรอง */}
          <div className="section">
            <h3 className="section-title">
              <span className="section-icon">🏆</span>
              ใบรับรอง
            </h3>
            
            <div className="upload-area">
              <input 
                type="file" 
                id="cert-upload"
                accept="image/*,application/pdf" 
                multiple 
                onChange={handleCertificateUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="cert-upload" className="upload-label">
                <div className="upload-icon">📄</div>
                <span>คลิกเพื่ออัปโหลดใบรับรอง</span>
                <small>รองรับไฟล์ JPG, PNG, PDF</small>
              </label>
            </div>

            {form.certificates.length > 0 && (
              <div className="cert-list">
                {form.certificates.map((c, i) => (
                  <div key={i} className="cert-item">
                    <span className="cert-icon">📜</span>
                    <span className="cert-name">ใบรับรอง #{i + 1}</span>
                    <button 
                      type="button" 
                      className="remove-cert-btn"
                      onClick={() => removeCertificate(i)}
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn">
            <span>✨</span>
            สร้างฟาร์ม
            <span>✨</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default styled(Createfarm)`
  min-height: 100vh;
  background: linear-gradient(135deg, #66ea68ff 0%, #4ba25eff 100%);
  padding: 40px 20px;

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: white;
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    p {
      margin-top: 20px;
      font-size: 18px;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
    color: white;
    
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: bounce 2s infinite;
    }
    
    h1 {
      font-size: 42px;
      margin: 0 0 10px 0;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .subtitle {
      font-size: 18px;
      opacity: 0.95;
      margin: 0;
    }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .form-box {
    background: white;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .section {
    margin-bottom: 35px;
    
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    margin-bottom: 20px;
    color: #333;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
    
    .section-icon {
      font-size: 24px;
    }
  }

  .input-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #555;
      font-size: 14px;
    }
    
    input, textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.3s;
      font-family: inherit;
      
      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      
      &::placeholder {
        color: #aaa;
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }

  .grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .upload-area {
    margin-bottom: 20px;
  }

  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    border: 3px dashed #d0d0d0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s;
    background: #fafafa;
    
    &:hover {
      border-color: #667eea;
      background: #f0f4ff;
      
      .upload-icon {
        transform: scale(1.1);
      }
    }
    
    .upload-icon {
      font-size: 48px;
      margin-bottom: 10px;
      transition: transform 0.3s;
    }
    
    span {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }
    
    small {
      color: #999;
      font-size: 13px;
    }
  }

  .preview-box {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }

  .preview-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 1;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(1.05);
      
      .remove-btn {
        opacity: 1;
      }
    }
  }

  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 59, 48, 0.95);
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s;
    
    &:hover {
      background: #ff3b30;
      transform: scale(1.1);
    }
  }

  .cert-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cert-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    transition: all 0.3s;
    
    &:hover {
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .cert-icon {
      font-size: 24px;
    }
    
    .cert-name {
      flex: 1;
      font-weight: 500;
      color: #333;
    }
    
    .remove-cert-btn {
      padding: 6px 16px;
      border: none;
      background: #ff3b30;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s;
      
      &:hover {
        background: #d32f2f;
        transform: scale(1.05);
      }
    }
  }

  .submit-btn {
    width: 100%;
    margin-top: 30px;
    padding: 18px;
    background: linear-gradient(135deg, #66ea7aff 0%, #4ba24fff 100%);
    border: none;
    color: white;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 8px 20px rgba(102, 234, 135, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(102, 234, 131, 0.5);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 20px 10px;
    
    .header {
      .icon {
        font-size: 48px;
      }
      
      h1 {
        font-size: 32px;
      }
      
      .subtitle {
        font-size: 16px;
      }
    }
    
    .form-box {
      padding: 25px 20px;
      border-radius: 16px;
    }
    
    .grid-2 {
      grid-template-columns: 1fr;
    }
    
    .preview-box {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }
`;