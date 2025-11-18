import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";

const FarmProfile = ({ className }) => {
  const { farmID } = useParams(); // ดึง FID จาก URL
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const farmerNID = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).NID : "";

  // Default farmer image
  const defaultFarmerImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23667eea' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='80' fill='white'%3E🧑‍🌾%3C/text%3E%3C/svg%3E";

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/farms/user/${farmerNID}`);
        localStorage.setItem("farms", JSON.stringify(res.data));
        setFarm(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchFarm();
  }, [farmID]);

  if (loading) {
    return (
      <div className={className}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>กำลังโหลดข้อมูลฟาร์ม...</p>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className={className}>
        <div className="error-container">
          <div className="error-icon">😢</div>
          <h2>ไม่พบข้อมูลฟาร์ม</h2>
          <Link to="/" className="back-btn">กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  const images = farm.storages?.filter(s => s.typeStorage === "image") || [];
  const videos = farm.storages?.filter(s => s.typeStorage === "video") || [];

  return (
    <div className={className}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="farm-badge">🌾 ฟาร์มออนไลน์</div>
          <h1 className="farm-title">{farm.farmName}</h1>
          <div className="location-tag">
            📍 {farm.Location?.subDistrict} {farm.Location?.district} {farm.Location?.province}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="gallery-section">
            <div className="main-image">
              <img src={images[activeImage]?.file} alt="Farm" />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail ${activeImage === idx ? "active" : ""}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img.file} alt={`Thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="content-grid">
          {/* Left Column */}
          <div className="main-content">
            {/* Story Section */}
            <div className="story-card">
              <div className="card-header">
                <h2>📖 เรื่องราวของเรา</h2>
              </div>
              <p className="story-text">
                {farm.description || "ยังไม่มีรายละเอียดเกี่ยวกับฟาร์ม"}
              </p>
            </div>

            {/* Certificates */}
            {farm.certificates && farm.certificates.length > 0 && (
              <div className="certificate-card">
                <div className="card-header">
                  <h2>🏆 ใบรับรองมาตรฐาน</h2>
                </div>
                <div className="cert-grid">
                  {farm.certificates.map((cert, idx) => (
                    <div key={idx} className="cert-item">
                      <div className="cert-icon">📜</div>
                      <div className="cert-info">
                        <h4>{cert.institution}</h4>
                        <button className="view-cert-btn">ดูใบรับรอง</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div className="video-card">
                <div className="card-header">
                  <h2>🎥 วิดีโอแนะนำฟาร์ม</h2>
                </div>
                <div className="video-grid">
                  {videos.map((video, idx) => (
                    <div key={idx} className="video-item">
                      <video controls>
                        <source src={video.file} />
                        เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="sidebar">
            {/* Farmer Card */}
            <div className="farmer-card">
              <div className="farmer-avatar">
                <img 
                  src={farm.User?.profileImage || defaultFarmerImage} 
                  alt="Farmer"
                  onError={(e) => { e.target.src = defaultFarmerImage; }}
                />
              </div>
              <h3 className="farmer-name">
                {farm.User?.username || "เกษตรกร"}
              </h3>
              <p className="farmer-role">เจ้าของฟาร์ม</p>
              
              {farm.User?.email && (
                <div className="farmer-info-item">
                  <span className="info-icon">📧</span>
                  <span>{farm.User.email}</span>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="contact-card">
              <div className="card-header">
                <h3>📞 ติดต่อเรา</h3>
              </div>
              
              {farm.phoneNumber && (
                <a href={`tel:${farm.phoneNumber}`} className="contact-item">
                  <span className="contact-icon">📱</span>
                  <div>
                    <div className="contact-label">โทรศัพท์</div>
                    <div className="contact-value">{farm.phoneNumber}</div>
                  </div>
                </a>
              )}

              {farm.email && (
                <a href={`mailto:${farm.email}`} className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <div className="contact-label">อีเมล</div>
                    <div className="contact-value">{farm.email}</div>
                  </div>
                </a>
              )}

              {farm.line && (
                <a href={`https://line.me/ti/p/${farm.line}`} target="_blank" rel="noopener noreferrer" className="contact-item">
                  <span className="contact-icon">💬</span>
                  <div>
                    <div className="contact-label">LINE</div>
                    <div className="contact-value">{farm.line}</div>
                  </div>
                </a>
              )}

              {farm.facebook && (
                <a href={`https://facebook.com/${farm.facebook}`} target="_blank" rel="noopener noreferrer" className="contact-item">
                  <span className="contact-icon">👥</span>
                  <div>
                    <div className="contact-label">Facebook</div>
                    <div className="contact-value">{farm.facebook}</div>
                  </div>
                </a>
              )}
            </div>

            {/* Action Button */}
            <Link to={`/farms/${farm.FID}/products`} className="products-btn">
              🛒 ดูสินค้าของฟาร์ม
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default styled(FarmProfile)`
  min-height: 100vh;
  background: #f5f7fa;

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e0e0e0;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    p {
      margin-top: 20px;
      color: #666;
      font-size: 16px;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    
    .error-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }
    
    h2 {
      color: #666;
      margin-bottom: 30px;
    }
    
    .back-btn {
      padding: 12px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s;
      
      &:hover {
        background: #5568d3;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
      }
    }
  }

  .hero-section {
    position: relative;
    height: 400px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    &::before {
      content: '🌾🌱🌿';
      position: absolute;
      font-size: 200px;
      opacity: 0.1;
      animation: float 20s infinite;
    }
    
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.2);
    }
    
    .hero-content {
      position: relative;
      text-align: center;
      color: white;
      z-index: 1;
      
      .farm-badge {
        display: inline-block;
        padding: 8px 20px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 600;
      }
      
      .farm-title {
        font-size: 56px;
        font-weight: 800;
        margin: 0 0 15px 0;
        text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
      }
      
      .location-tag {
        font-size: 18px;
        opacity: 0.95;
      }
    }
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(50px, -50px) rotate(10deg); }
    66% { transform: translate(-30px, 30px) rotate(-10deg); }
  }

  .container {
    max-width: 1400px;
    margin: -80px auto 0;
    padding: 0 20px 60px;
    position: relative;
    z-index: 2;
  }

  .gallery-section {
    background: white;
    border-radius: 24px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    
    .main-image {
      width: 100%;
      height: 500px;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 20px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .thumbnail-list {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      padding-bottom: 10px;
      
      &::-webkit-scrollbar {
        height: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }
    }
    
    .thumbnail {
      width: 120px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.3s;
      flex-shrink: 0;
      
      &.active {
        border-color: #667eea;
        transform: scale(1.05);
      }
      
      &:hover {
        border-color: #764ba2;
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 30px;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .story-card, .certificate-card, .video-card {
    background: white;
    border-radius: 24px;
    padding: 35px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  }

  .card-header {
    margin-bottom: 25px;
    
    h2, h3 {
      font-size: 24px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
    }
  }

  .story-text {
    font-size: 16px;
    line-height: 1.8;
    color: #555;
    margin: 0;
  }

  .cert-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .cert-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 25px;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%);
    border-radius: 16px;
    border: 2px solid #f0f0f0;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      border-color: #667eea;
    }
    
    .cert-icon {
      font-size: 48px;
    }
    
    .cert-info {
      flex: 1;
      
      h4 {
        margin: 0 0 10px 0;
        font-size: 18px;
        color: #333;
      }
      
      .view-cert-btn {
        padding: 8px 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s;
        
        &:hover {
          background: #5568d3;
          transform: scale(1.05);
        }
      }
    }
  }

  .video-grid {
    display: grid;
    gap: 20px;
  }

  .video-item {
    border-radius: 16px;
    overflow: hidden;
    
    video {
      width: 100%;
      border-radius: 16px;
    }
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .farmer-card {
    background: white;
    border-radius: 24px;
    padding: 35px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    
    .farmer-avatar {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      border-radius: 50%;
      overflow: hidden;
      border: 5px solid #f0f0f0;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .farmer-name {
      font-size: 22px;
      font-weight: 700;
      color: #333;
      margin: 0 0 5px 0;
    }
    
    .farmer-role {
      color: #999;
      font-size: 14px;
      margin: 0 0 20px 0;
    }
    
    .farmer-info-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 12px;
      font-size: 14px;
      color: #666;
    }
  }

  .contact-card {
    background: white;
    border-radius: 24px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 18px;
      margin-top: 15px;
      background: #f8f9fa;
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.3s;
      
      &:first-of-type {
        margin-top: 0;
      }
      
      &:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: translateX(5px);
        
        .contact-icon {
          transform: scale(1.2);
        }
        
        .contact-label, .contact-value {
          color: white;
        }
      }
      
      .contact-icon {
        font-size: 28px;
        transition: transform 0.3s;
      }
      
      .contact-label {
        font-size: 12px;
        color: #999;
        font-weight: 600;
        text-transform: uppercase;
        transition: color 0.3s;
      }
      
      .contact-value {
        font-size: 15px;
        color: #333;
        font-weight: 600;
        transition: color 0.3s;
      }
    }
  }

  .products-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px;
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: #333;
    text-decoration: none;
    border-radius: 16px;
    font-weight: 700;
    font-size: 16px;
    transition: all 0.3s;
    box-shadow: 0 8px 20px rgba(67, 233, 123, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(67, 233, 123, 0.4);
    }
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
    
    .sidebar {
      max-width: 600px;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .hero-section {
      height: 300px;
      
      .hero-content {
        .farm-title {
          font-size: 36px;
        }
      }
    }
    
    .container {
      margin-top: -60px;
    }
    
    .gallery-section .main-image {
      height: 300px;
    }
    
    .story-card, .certificate-card, .video-card {
      padding: 25px 20px;
    }
  }
`;