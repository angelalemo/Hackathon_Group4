import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { Bookmark } from "lucide-react";

const BOOKMARKS_API_BASE = "http://localhost:4000/bookmarks";
const Product = ({ className }) => {
  const { PID } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [farmInfo, setFarmInfo] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(PID);
        setLoading(true);
        const res = await axios.get(`http://localhost:4000/products/${Number(PID)}`);
        console.log(res.data);
        setProduct(res.data);
        setError(null);
        
        // ตรวจสอบว่า bookmark หรือยัง (ถ้ามี user login)
        const user = localStorage.getItem("user");
        if (user) {
          checkBookmarkStatus(res.data.PID);
        }

        // ดึงข้อมูลฟาร์ม
        if (res.data.FID) {
          try {
            const farmRes = await axios.get(`http://localhost:4000/farms/${res.data.FID}`);
            setFarmInfo(farmRes.data);
          } catch (farmErr) {
            console.error("Error fetching farm info:", farmErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
      } finally {
        setLoading(false);
      }
    };
    
    if (PID) {
      fetchProduct();
    }
  }, [PID]);

  // ฟังก์ชันตรวจสอบสถานะ bookmark
  const checkBookmarkStatus = async (productId) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      const currentUser = user.user || user;
      if (!currentUser?.NID) return;

      const res = await axios.get(
        `${BOOKMARKS_API_BASE}/check/${currentUser.NID}/${productId}`
      );
      setIsBookmarked(res.data.isBookmarked);
    } catch (err) {
      console.error("Error checking bookmark:", err);
    }
  };

  // ฟังก์ชัน toggle bookmark
  const handleBookmarkToggle = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("กรุณาเข้าสู่ระบบก่อนบันทึกสินค้า");
        return;
      }

      const user = JSON.parse(userData);
      const currentUser = user.user || user;
      if (!currentUser?.NID) {
        alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง");
        return;
      }

      setBookmarkLoading(true);

      if (isBookmarked) {
        await axios.delete(
          `${BOOKMARKS_API_BASE}/remove/${currentUser.NID}/${product.PID}`
        );
        setIsBookmarked(false);
      } else {
        await axios.post(`${BOOKMARKS_API_BASE}/add`, {
          NID: currentUser.NID,
          PID: product.PID,
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleChatWithFarm = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("กรุณาเข้าสู่ระบบก่อนเริ่มแชทกับร้านค้า");
      return;
    }

    const user = JSON.parse(userData);
    const currentUser = user.user || user;
    if (!currentUser?.NID) {
      alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      return;
    }

    try {
      // เพิ่มสินค้าเข้า Bookmark
      try {
        await axios.post(`${BOOKMARKS_API_BASE}/add`, {
          NID: currentUser.NID,
          PID: product.PID,
        });
        setIsBookmarked(true);
      } catch (bookmarkError) {
        // ถ้า bookmark อยู่แล้วก็ไม่เป็นไร
        if (bookmarkError.response?.status !== 400) {
          console.error("Error adding bookmark:", bookmarkError);
        }
      }

      // สร้างหรือหา chat room
      const response = await axios.post("http://localhost:4000/chats/create", {
        NID: currentUser.NID,
        FID: product.FID,
      });

      const chat = response.data?.chat;
      if (chat?.logID) {
        navigate(`/chat/${chat.logID}/${product.FID}`, {
          state: { product },
        });
      } else {
        throw new Error("ไม่สามารถสร้างห้องแชทได้");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("ไม่สามารถเริ่มแชทได้ กรุณาลองใหม่");
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="loading">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={className}>
        <div className="error">ไม่พบข้อมูลสินค้า</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="product-container">
        <div className="image-section">
          <img src={product.image} alt={product.productName} />
        </div>

        <div className="info-section">
          <h1 className="product-name">{product.productName}</h1>

          {farmInfo && product.FID && (
            <div className="farm-info-card" onClick={() => navigate(`/farms/${product.FID}`)}>
              <div className="farm-icon">🌾</div>
              <div className="farm-details">
                <div className="farm-label">ฟาร์ม</div>
                <div className="farm-name">{farmInfo.farmName || "ฟาร์ม"}</div>
              </div>
              <div className="farm-arrow">›</div>
            </div>
          )}

          <div className="detail-card">
            <div className="detail-row">
              <span className="label">หมวดหมู่:</span>
              <span className="value">
                {product.category || product.Category || product.CATEGORY || "-"}
              </span>
            </div>

            <div className="detail-row">
              <span className="label">ประเภทการขาย:</span>
              <span className="value">
                {product.saleType || product.sale_type || product.SaleType || "-"}
              </span>
            </div>
          </div>

          <div className="price-card">
            <span className="price-label">ราคา</span>
            <div className="price-value">
              <span className="price">{product.price}</span>
              <span className="currency">บาท</span>
            </div>
          </div>

          <button type="button" className="chat-btn" onClick={handleChatWithFarm}>
            <span className="icon">💬</span>
            <span>แชทกับร้านค้า</span>
          </button>

          <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
          >
            <Bookmark 
              size={20} 
              fill={isBookmarked ? '#2196f3' : 'none'}
              color={isBookmarked ? '#2196f3' : '#1565c0'}
            />
            <span>
              {bookmarkLoading 
                ? 'กำลังบันทึก...' 
                : isBookmarked 
                  ? 'บันทึกแล้ว' 
                  : 'บันทึกสินค้า'
              }
            </span>
          </button>

          <div className="product-id">
            รหัสสินค้า: #{product.PID}
          </div>
        </div>
      </div>
    </div>
  );
};

export default styled(Product)`
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%);
  padding: 0;

  .loading,
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-size: 20px;
    color: #1565c0;
    font-weight: 500;
  }

  .error {
    color: #d32f2f;
  }

  .product-container {
    background: #ffffff;
    min-height: 100vh;
  }

  .image-section {
    width: 100%;
    height: 400px;
    background: linear-gradient(135deg, #4caf50 0%, #2196f3 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .info-section {
    padding: 24px;
  }

  .product-name {
    font-size: 28px;
    color: #1565c0;
    margin: 0 0 24px 0;
    font-weight: 700;
  }

  .farm-info-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      background: #f5f5f5;
      border-color: #1565c0;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(21, 101, 192, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .farm-icon {
    font-size: 32px;
    flex-shrink: 0;
  }

  .farm-details {
    flex: 1;
    min-width: 0;
  }

  .farm-label {
    font-size: 12px;
    color: #757575;
    margin-bottom: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .farm-name {
    font-size: 18px;
    color: #1565c0;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .farm-arrow {
    font-size: 24px;
    color: #1565c0;
    flex-shrink: 0;
    font-weight: 300;
  }

  .detail-card {
    background: #f1f8e9;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    border-left: 5px solid #66bb6a;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;

    &:not(:last-child) {
      border-bottom: 1px solid #c8e6c9;
    }
  }

  .label {
    color: #2e7d32;
    font-weight: 500;
    font-size: 16px;
  }

  .value {
    color: #1565c0;
    font-weight: 600;
    font-size: 16px;
  }

  .price-card {
    background: linear-gradient(135deg, #4caf50 0%, #2196f3 100%);
    padding: 24px;
    border-radius: 16px;
    text-align: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .price-label {
    display: block;
    color: #ffffff;
    font-size: 14px;
    margin-bottom: 8px;
    opacity: 0.95;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .price-value {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
  }

  .price {
    font-size: 42px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }

  .currency {
    font-size: 20px;
    color: #ffffff;
    font-weight: 600;
  }

  .chat-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
    color: #ffffff;
    text-decoration: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    transition: all 0.3s ease;
    border: none;

    &:hover {
      background: linear-gradient(135deg, #388e3c 0%, #43a047 100%);
      box-shadow: 0 6px 16px rgba(76, 175, 80, 0.5);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    .icon {
      font-size: 24px;
    }
  }

  .bookmark-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px;
    background: #ffffff;
    color: #1565c0;
    text-decoration: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: 2px solid #1565c0;
    transition: all 0.3s ease;
    margin-top: 12px;

    &:hover {
      background: #e3f2fd;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.bookmarked {
      background: #e3f2fd;
      border-color: #2196f3;
      color: #2196f3;
    }
  }

  .product-id {
    text-align: center;
    margin-top: 20px;
    color: #757575;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .image-section {
      height: 300px;
      padding: 20px;
    }

    .product-name {
      font-size: 24px;
    }

    .price {
      font-size: 36px;
    }
  }
`;