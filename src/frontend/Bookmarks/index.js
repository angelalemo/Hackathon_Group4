import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000/bookmarks";

const BookmarksPage = ({ className }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      setCurrentUser(parsed.user || parsed);
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("เกิดข้อผิดพลาดในการอ่านข้อมูลผู้ใช้");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!currentUser?.NID) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/${currentUser.NID}`
        );
        const bookmarksData = response.data || [];
        
        // จัดกลุ่มตามร้าน (FID)
        const groupedByFarm = {};
        bookmarksData.forEach((bookmark) => {
          const FID = bookmark.Product?.Farm?.FID;
          if (FID) {
            if (!groupedByFarm[FID]) {
              groupedByFarm[FID] = {
                FID: FID,
                farmName: bookmark.Product?.Farm?.farmName || "ไม่ระบุชื่อฟาร์ม",
                products: [],
              };
            }
            groupedByFarm[FID].products.push(bookmark);
          }
        });
        
        setBookmarks(Object.values(groupedByFarm));
        setError("");
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("ไม่สามารถดึงข้อมูลบุ๊กมาร์กได้");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [currentUser]);

  const handleRemoveBookmark = async (PID, FID) => {
    if (!currentUser?.NID) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/remove/${currentUser.NID}/${PID}`
      );
      // อัปเดต state โดยลบสินค้าออกจากกลุ่มร้าน
      setBookmarks((prev) => {
        return prev
          .map((farmGroup) => {
            if (farmGroup.FID === FID) {
              const updatedProducts = farmGroup.products.filter(
                (item) => item.PID !== PID
              );
              // ถ้าไม่มีสินค้าเหลือแล้ว ให้ลบกลุ่มร้านนี้ออก
              if (updatedProducts.length === 0) {
                return null;
              }
              return { ...farmGroup, products: updatedProducts };
            }
            return farmGroup;
          })
          .filter((farmGroup) => farmGroup !== null);
      });
    } catch (err) {
      console.error("Error removing bookmark:", err);
      alert("ลบออกจากบุ๊กมาร์กไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleSendToChat = async (product, FID) => {
    if (!currentUser?.NID || !FID || !product) {
      alert("ไม่พบข้อมูลที่จำเป็น");
      return;
    }

    try {
      // สร้างหรือหา chat room
      const chatResponse = await axios.post("http://localhost:4000/chats/create", {
        NID: currentUser.NID,
        FID: FID,
      });

      const chat = chatResponse.data?.chat;
      if (!chat?.logID) {
        throw new Error("ไม่สามารถสร้างห้องแชทได้");
      }

      // ส่งข้อมูลสินค้าเข้าแชท
      const productMessage = `__PRODUCT__:${JSON.stringify({
        PID: product.PID,
        productName: product.productName,
        price: product.price,
        image: product.image,
        category: product.category,
        saleType: product.saleType,
        FID: product.FID,
      })}`;

      await axios.post("http://localhost:4000/chats/message", {
        logID: chat.logID,
        senderNID: currentUser.NID,
        messageText: productMessage,
      });

      // ไปหน้าแชท
      navigate(`/chat/${chat.logID}/${FID}`, {
        state: { product },
      });
    } catch (error) {
      console.error("Error sending product to chat:", error);
      alert("ไม่สามารถส่งสินค้าเข้าแชทได้ กรุณาลองใหม่");
    }
  };

  if (!currentUser) {
    return (
      <div className={className}>
        <div className="empty-state">
          <h2>กรุณาเข้าสู่ระบบ</h2>
          <p>ต้องเข้าสู่ระบบก่อนจึงจะดูรายการบุ๊กมาร์กได้</p>
          <Link to="/login" className="primary-btn">
            ไปยังหน้าล็อกอิน
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="loading-state">กำลังโหลดบุ๊กมาร์ก...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="empty-state">
          <h2>เกิดข้อผิดพลาด</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="container">
        <div className="header">
          <h1>บุ๊กมาร์กของฉัน</h1>
          <p>
            {bookmarks.reduce((total, farm) => total + farm.products.length, 0)} รายการ
            จาก {bookmarks.length} ร้าน
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="empty-state">
            <h2>ยังไม่มีสินค้าในบุ๊กมาร์ก</h2>
            <p>ไปที่หน้าสินค้าแล้วกดบุ๊กมาร์กเพื่อบันทึกสินค้าไว้ดูภายหลัง</p>
            <button className="primary-btn" onClick={() => navigate("/")}>
              กลับหน้าหลัก
            </button>
          </div>
        ) : (
          <div className="farm-groups">
            {bookmarks.map((farmGroup) => (
              <div key={farmGroup.FID} className="farm-group">
                <div className="farm-group-header">
                  <h2>{farmGroup.farmName}</h2>
                  <p>{farmGroup.products.length} สินค้า</p>
                </div>
                <div className="products-list">
                  {farmGroup.products.map((bookmark) => (
                    <div key={bookmark.id} className="card">
                      <div className="image-wrapper">
                        <img
                          src={
                            bookmark.Product?.image ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={bookmark.Product?.productName || "Product"}
                        />
                      </div>
                      <div className="card-body">
                        <h3>{bookmark.Product?.productName || "ไม่ทราบชื่อสินค้า"}</h3>
                        <p className="price">
                          {bookmark.Product?.price != null
                            ? `${bookmark.Product.price} บาท`
                            : "ไม่ระบุราคา"}
                        </p>
                        <div className="card-actions">
                          <Link
                            to={`/product/${bookmark.PID}`}
                            className="primary-btn"
                          >
                            ดูสินค้า
                          </Link>
                          <button
                            type="button"
                            className="send-chat-btn"
                            onClick={() => handleSendToChat(bookmark.Product, farmGroup.FID)}
                          >
                            ส่งเข้าแชท
                          </button>
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => handleRemoveBookmark(bookmark.PID, farmGroup.FID)}
                          >
                            ลบออก
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default styled(BookmarksPage)`
  min-height: 100vh;
  background: #f5f7fb;
  padding: 30px 20px 60px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    margin-bottom: 25px;

    h1 {
      margin: 0;
      font-size: 32px;
      color: #1f2937;
    }

    p {
      margin: 6px 0 0 0;
      color: #6b7280;
    }
  }

  .loading-state,
  .empty-state {
    background: white;
    border-radius: 20px;
    padding: 50px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  }

  .empty-state h2 {
    margin-top: 0;
    color: #1f2937;
  }

  .primary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 16px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(22, 163, 74, 0.25);
    }
  }

  .farm-groups {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .farm-group {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  }

  .farm-group-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e5e7eb;

    h2 {
      margin: 0 0 4px 0;
      color: #1f2937;
      font-size: 24px;
    }

    p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
  }

  .products-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .card {
    background: #f9fafb;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e7eb;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
    }
  }

  .image-wrapper {
    width: 100%;
    height: 200px;
    background: #e5e7eb;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      margin: 0;
      color: #111827;
      font-size: 20px;
    }

    .price {
      margin: 0;
      color: #16a34a;
      font-weight: 700;
      font-size: 18px;
    }

    .farm-name {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
  }

  .card-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;

    .primary-btn {
      flex: 1;
      margin-top: 0;
      min-width: 100px;
    }

    .send-chat-btn {
      padding: 12px 18px;
      border-radius: 12px;
      border: 1px solid #22c55e;
      background: white;
      color: #22c55e;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s, color 0.2s;

      &:hover {
        background: #22c55e;
        color: white;
      }
    }

    .remove-btn {
      padding: 12px 18px;
      border-radius: 12px;
      border: 1px solid #ef4444;
      background: white;
      color: #ef4444;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s, color 0.2s;

      &:hover {
        background: #ef4444;
        color: white;
      }
    }
  }
`;

