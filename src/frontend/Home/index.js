import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Homepage = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider images (ตัวอย่าง - ใส่ URL จริงของคุณ)
  const slides = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
  ];

  // หมวดหมู่แถวที่ 1
  const categories1 = [
    { name: "คะน้า", image: "🥬" },
    { name: "ผักกาดขาว", image: "🥗" },
    { name: "หัวหอม", image: "🧅" },
    { name: "มะเขือเทศ", image: "🍅" },
    { name: "พริกชี้ฟ้า", image: "🌶️" },
    { name: "แตงกวา", image: "🥒" },
    { name: "ต้นหอม", image: "🌱" },
  ];

  // หมวดหมู่แถวที่ 2
  const categories2 = [
    { name: "หัวไชเท้า", image: "🥕" },
    { name: "ตะไคร้", image: "🌿" },
    { name: "ใบมะกรูด", image: "🍃" },
    { name: "โหระพา", image: "🌿" },
    { name: "แรดิช", image: "🥕" },
    { name: "แครอท", image: "🥕" },
    { name: "ผักกาดหวาน", image: "🥬" },
  ];

  // Fetch farmers และ farms data
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        
        // ดึงข้อมูล users ทั้งหมด
        const usersResponse = await axios.get("/users/All");
        
        // กรองเฉพาะ Farmer
        const farmersOnly = usersResponse.data.filter(
          user => user.type === "Farmer"
        );

        // ดึงข้อมูลฟาร์มของแต่ละเกษตรกร
        const farmersWithFarms = await Promise.all(
          farmersOnly.map(async (farmer) => {
            try {
              const farmResponse = await axios.get(`/farms/user/${farmer.NID}`);
              return {
                ...farmer,
                farmName: farmResponse.data?.[0]?.farmName || "ไม่มีฟาร์ม",
                farmData: farmResponse.data?.[0] || null
              };
            } catch (error) {
              console.error(`Error fetching farm for user ${farmer.NID}:`, error);
              return {
                ...farmer,
                farmName: "ไม่มีฟาร์ม",
                farmData: null
              };
            }
          })
        );
        
        setFarmers(farmersWithFarms);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching farmers:", error);
        setLoading(false);
        
        // ใช้ข้อมูล mock ถ้า API ไม่พร้อม
        const mockFarmers = [
          { NID: 1, username: "สมชาย", farmName: "ฟาร์มสุขใจ", ProfileImage: null },
          { NID: 2, username: "สมหญิง", farmName: "ฟาร์มอินทรีย์", ProfileImage: null },
          { NID: 3, username: "สมศักดิ์", farmName: "ฟาร์มปลอดสาร", ProfileImage: null },
        ];
        setFarmers(mockFarmers);
      }
    };

    fetchFarmers();
  }, []);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={className}>
      {/* Image Slider */}
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide} alt={`Slide ${index + 1}`} />
              <div className="slide-overlay">
                <h1>PHAKTAE</h1>
                <p>เชื่อมโยงเกษตรกรอินทรีย์กับผู้บริโภค</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="slider-btn prev" onClick={prevSlide}>‹</button>
        <button className="slider-btn next" onClick={nextSlide}>›</button>
        
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* About PHAKTAE */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="icon-large">🌾</div>
            <h2>ความเป็นมาของ PHAKTAE</h2>
            <p className="about-text">
              <strong>PHAKTAE</strong> คือ แพลตฟอร์มเชื่อมโยงเกษตรกรอินทรีย์กับผู้บริโภคโดยตรง 
              โดยใช้ช่องทางดิจิทัลที่ชุมชนเข้าถึงได้ เพื่อให้เกิด{" "}
              <span className="highlight">"สะพานดิจิทัล"</span>{" "}
              ที่เชื่อมคนกินกับคนปลูก สร้างความโปร่งใส มั่นใจ 
              และเป็นธรรมสำหรับทุกฝ่าย
            </p>
          </div>
        </div>
      </section>

      {/* PGS Section */}
      <section className="pgs-section">
        <div className="container">
          <h2 className="section-title">
            <span className="icon">🏆</span>
            ใบรับรอง PGS
          </h2>
          
          <div className="pgs-grid">
            <div className="pgs-content">
              <h3>ใบรับรอง PGS คืออะไร?</h3>
              <p>
                <strong>Participatory Organic Guarantee System (PGS)</strong> 
                เป็นการรับประกันคุณภาพผลผลิตอินทรีย์ของชุมชนที่เหมาะสมกับสภาพ
                ภูมิสังคม สิ่งแวดล้อม วัฒนธรรม และการเกษตรของท้องถิ่น
              </p>
              <p>
                กระบวนการมีส่วนร่วมของผู้มีส่วนได้ส่วนเสีย ตั้งแต่ผู้ผลิต 
                ผู้ประกอบการ นักพัฒนาวิชาการ และผู้บริโภค คือหัวใจของระบบ
              </p>
              <p>
                PGS เป็นกระบวนการที่พัฒนาอย่างต่อเนื่อง อาศัยการแลกเปลี่ยนความรู้ 
                ความซื่อสัตย์ และไว้วางใจกันเพื่อความเชื่อมั่นในระดับชุมชน
              </p>
              <div className="pgs-features">
                <div className="feature">✓ รับรองโดยชุมชน</div>
                <div className="feature">✓ โปร่งใส ตรวจสอบได้</div>
                <div className="feature">✓ เหมาะกับท้องถิ่น</div>
                <div className="feature">✓ พัฒนาอย่างต่อเนื่อง</div>
              </div>
            </div>
            
            <div className="pgs-logo">
              <div className="logo-circle">
                <div className="logo-content">
                  <div className="leaf-icon">🌿</div>
                  <div className="logo-text">PGS</div>
                  <div className="logo-subtext">Organic</div>
                  <div className="logo-subtext">Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmers Section */}
      <section className="farmers-section">
        <div className="container">
          <h2 className="section-title">
            <span className="icon">👨‍🌾</span>
            เกษตรกร
          </h2>
          
          {loading ? (
            <div className="loading-box">
              <div className="spinner"></div>
              <p>กำลังโหลดข้อมูลเกษตรกร...</p>
            </div>
          ) : (
            <div className="farmers-scroll">
              <div className="farmers-grid">
                {farmers.map((farmer) => (
                  <div key={farmer.NID} className="farmer-card">
                    <div className="farmer-avatar">
                      {farmer.ProfileImage ? (
                        <img src={farmer.ProfileImage} alt={farmer.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {farmer.username.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="farmer-info">
                      <h3>{farmer.username}</h3>
                      <p className="farm-name">
                        <span className="farm-icon">🏡</span>
                        {farmer.farmName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">
            <span className="icon">🥬</span>
            หมวดหมู่
          </h2>
          
          {/* Row 1 */}
          <div className="category-scroll">
            <div className="category-row">
              {categories1.map((cat, index) => (
                <div key={index} className="category-item">
                  <div className="category-circle">
                    <span className="category-emoji">{cat.image}</span>
                  </div>
                  <p className="category-name">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="category-scroll">
            <div className="category-row">
              {categories2.map((cat, index) => (
                <div key={index} className="category-item">
                  <div className="category-circle">
                    <span className="category-emoji">{cat.image}</span>
                  </div>
                  <p className="category-name">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-shape">
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="#2E7D32" d="M0,50 Q360,0 720,50 T1440,50 L1440,0 L0,0 Z" opacity="0.3"/>
            <path fill="#4CAF50" d="M0,70 Q360,20 720,70 T1440,70 L1440,0 L0,0 Z" opacity="0.5"/>
            <path fill="#1565C0" d="M0,90 Q360,40 720,90 T1440,90 L1440,0 L0,0 Z"/>
          </svg>
        </div>
        
        <div className="footer-content">
          <div className="container">
            <div className="footer-grid">
              {/* Logo & Address */}
              <div className="footer-col">
                <div className="footer-logo">
                  <div className="logo-icon">🌾</div>
                  <h3>PHAKTAE</h3>
                </div>
                <p className="address">
                  313 อาคาร ชิ.พี. ทาวเวอร์ ชั้น 16 ถนนสีลม แขวงสีลม<br/>
                  เขตบางรัก กรุงเทพฯ 10500
                </p>
                <a href="#" className="map-link">
                  🗺️ ดูแผนที่บน Google Maps
                </a>
                
                <div className="social-links">
                  <a href="#" className="social-icon" aria-label="LinkedIn">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon" aria-label="Facebook">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon" aria-label="YouTube">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* บริษัท */}
              <div className="footer-col">
                <h4>บริษัท</h4>
                <ul className="footer-links">
                  <li><a href="#">รู้จักเรา</a></li>
                  <li><a href="#">รางวัลและความสำเร็จ</a></li>
                  <li><a href="#">ข่าวและบทความ</a></li>
                  <li><a href="#">ร่วมงานกับ PHAKTAE</a></li>
                </ul>
              </div>

              {/* ธุรกิจ */}
              <div className="footer-col">
                <h4>ธุรกิจ PHAKTAE</h4>
                <ul className="footer-links">
                  <li><a href="#">ผลิตภัณฑ์</a></li>
                  <li><a href="#">ความโปร่งใสจากทุกฟาร์ม</a></li>
                </ul>
              </div>

              {/* ติดต่อเรา */}
              <div className="footer-col">
                <h4>ติดต่อเรา</h4>
                <ul className="footer-links">
                  <li><a href="#">สนใจผลิตภัณฑ์และบริการ</a></li>
                  <li><a href="#">สอบถามข้อมูลเพิ่มเติม</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© สงวนลิขสิทธิ์ 2566 แบรนด์ แน็กซอน</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default styled(Homepage)`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  background: #f8fafb;
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* ========== SLIDER ========== */
  .slider-container {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    background: #1a472a;
  }

  .slider {
    display: flex;
    height: 100%;
    transition: transform 0.5s ease-in-out;
  }

  .slide {
    position: relative;
    min-width: 100%;
    height: 100%;
  }

  .slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
  }

  .slide-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 2;
  }

  .slide-overlay h1 {
    font-size: 72px;
    font-weight: 900;
    margin-bottom: 15px;
    text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
    letter-spacing: 4px;
  }

  .slide-overlay p {
    font-size: 24px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  .slider-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.3);
    border: none;
    color: white;
    font-size: 48px;
    padding: 15px 20px;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 3;
    backdrop-filter: blur(5px);
  }

  .slider-btn:hover {
    background: rgba(255,255,255,0.5);
  }

  .slider-btn.prev {
    left: 20px;
  }

  .slider-btn.next {
    right: 20px;
  }

  .slider-dots {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 3;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: all 0.3s;
  }

  .dot.active {
    background: white;
    width: 30px;
    border-radius: 6px;
  }

  /* ========== ABOUT SECTION ========== */
  .about-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #2E7D32 0%, #1565C0 100%);
  }

  .about-content {
    text-align: center;
    color: white;
  }

  .icon-large {
    font-size: 80px;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .about-content h2 {
    font-size: 42px;
    margin-bottom: 25px;
    font-weight: 700;
  }

  .about-text {
    font-size: 20px;
    line-height: 1.8;
    max-width: 900px;
    margin: 0 auto;
  }

  .highlight {
    background: rgba(255,255,255,0.25);
    padding: 3px 12px;
    border-radius: 6px;
    font-weight: 700;
  }

  /* ========== PGS SECTION ========== */
  .pgs-section {
    padding: 80px 0;
    background: white;
  }

  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    font-size: 38px;
    margin-bottom: 50px;
    color: #1a472a;
  }

  .section-title .icon {
    font-size: 42px;
  }

  .pgs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .pgs-content h3 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #2E7D32;
  }

  .pgs-content p {
    font-size: 16px;
    line-height: 1.8;
    color: #555;
    margin-bottom: 15px;
  }

  .pgs-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 30px;
  }

  .feature {
    background: linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%);
    padding: 15px 20px;
    border-radius: 12px;
    color: #1a472a;
    font-weight: 600;
    font-size: 15px;
    border: 2px solid #4CAF50;
  }

  .pgs-logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-circle {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2E7D32 0%, #1565C0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 60px rgba(46, 125, 50, 0.3);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .logo-content {
    text-align: center;
    color: white;
  }

  .leaf-icon {
    font-size: 80px;
    margin-bottom: 15px;
  }

  .logo-text {
    font-size: 48px;
    font-weight: 900;
    letter-spacing: 3px;
  }

  .logo-subtext {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
  }

  /* ========== FARMERS SECTION ========== */
  .farmers-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%);
  }

  .loading-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #2E7D32;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #E8F5E9;
    border-top: 4px solid #2E7D32;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-box p {
    font-size: 18px;
    font-weight: 500;
  }

  .farmers-scroll {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #4CAF50 #f0f0f0;
  }

  .farmers-scroll::-webkit-scrollbar {
    height: 8px;
  }

  .farmers-scroll::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
  }

  .farmers-scroll::-webkit-scrollbar-thumb {
    background: #4CAF50;
    border-radius: 10px;
  }

  .farmers-grid {
    display: flex;
    gap: 25px;
    padding: 10px 0;
  }

  .farmer-card {
    min-width: 280px;
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(46, 125, 50, 0.15);
    transition: all 0.3s;
    cursor: pointer;
    border: 2px solid transparent;
  }

  .farmer-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(46, 125, 50, 0.25);
    border-color: #4CAF50;
  }

  .farmer-avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #4CAF50;
  }

  .farmer-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2E7D32 0%, #1565C0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    color: white;
    font-weight: 700;
  }

  .farmer-info {
    text-align: center;
  }

  .farmer-info h3 {
    font-size: 22px;
    margin-bottom: 10px;
    color: #1a472a;
  }

  .farm-name {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    color: #666;
  }

  .farm-icon {
    font-size: 18px;
  }

  /* ========== CATEGORIES SECTION ========== */
  .categories-section {
    padding: 80px 0;
    background: white;
  }

  .category-scroll {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #4CAF50 #f0f0f0;
    margin-bottom: 30px;
  }

  .category-scroll::-webkit-scrollbar {
    height: 8px;
  }

  .category-scroll::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
  }

  .category-scroll::-webkit-scrollbar-thumb {
    background: #4CAF50;
    border-radius: 10px;
  }

  .category-row {
    display: flex;
    gap: 30px;
    padding: 20px 0;
  }

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 120px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .category-item:hover {
    transform: translateY(-5px);
  }

  .category-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    box-shadow: 0 4px 15px rgba(46, 125, 50, 0.15);
    transition: all 0.3s;
    border: 3px solid #fff;
  }

  .category-item:hover .category-circle {
    background: linear-gradient(135deg, #4CAF50 0%, #2196F3 100%);
    box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
    border-color: #4CAF50;
  }

  .category-emoji {
    font-size: 48px;
  }

  .category-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a472a;
    text-align: center;
  }

  /* ========== FOOTER ========== */
  .footer {
    position: relative;
    background: #1565C0;
    color: white;
    overflow: hidden;
  }

  .footer-shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: translateY(-99%);
  }

  .footer-shape svg {
    display: block;
    width: 100%;
    height: 100px;
  }

  .footer-content {
    padding: 80px 0 30px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 50px;
    margin-bottom: 50px;
  }

  .footer-col h4 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
    color: white;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .logo-icon {
    font-size: 36px;
  }

  .footer-logo h3 {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: 2px;
    margin: 0;
  }

  .address {
    font-size: 14px;
    line-height: 1.8;
    opacity: 0.9;
    margin-bottom: 15px;
  }

  .map-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: white;
    text-decoration: none;
    font-size: 14px;
    padding: 8px 16px;
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
    transition: all 0.3s;
    margin-bottom: 25px;
  }

  .map-link:hover {
    background: rgba(255,255,255,0.2);
  }

  .social-links {
    display: flex;
    gap: 15px;
  }

  .social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s;
    text-decoration: none;
  }

  .social-icon:hover {
    background: white;
    color: #1565C0;
    transform: translateY(-3px);
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 12px;
  }

  .footer-links a {
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s;
    display: inline-block;
  }

  .footer-links a:hover {
    color: white;
    transform: translateX(5px);
  }

  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 25px;
    text-align: center;
  }

  .footer-bottom p {
    font-size: 14px;
    opacity: 0.8;
    margin: 0;
  }

  /* ========== RESPONSIVE ========== */
  @media (max-width: 968px) {
    .pgs-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .logo-circle {
      width: 250px;
      height: 250px;
    }

    .footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
  }

  @media (max-width: 768px) {
    .slider-container {
      height: 400px;
    }

    .slide-overlay h1 {
      font-size: 48px;
    }

    .slide-overlay p {
      font-size: 18px;
    }

    .about-content h2 {
      font-size: 32px;
    }

    .about-text {
      font-size: 16px;
    }

    .section-title {
      font-size: 28px;
    }

    .pgs-content h3 {
      font-size: 22px;
    }

    .pgs-features {
      grid-template-columns: 1fr;
    }

    .footer-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .footer-content {
      padding: 60px 0 20px;
    }
  }
`;