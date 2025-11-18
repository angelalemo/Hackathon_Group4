import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaUser, FaPaperPlane, FaImage, FaBookmark, FaTimes } from "react-icons/fa";

const API_BASE_URL = "http://localhost:4000/chats";
const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60";

const ChatPage = ({ className }) => {
  const { logID, FID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [farmInfo, setFarmInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [highlightProduct, setHighlightProduct] = useState(
    location.state?.product || null
  );
  const [chatMeta, setChatMeta] = useState(location.state?.chatMeta || null);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);
  const [bookmarkProducts, setBookmarkProducts] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const isFarmer = currentUser?.type === "Farmer";

  // ดึงข้อมูล user จาก localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setCurrentUser(parsed.user || parsed);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (location.state?.product) {
      setHighlightProduct(location.state.product);
    }
    if (location.state?.chatMeta) {
      setChatMeta(location.state.chatMeta);
    }
  }, [location.state]);

  useEffect(() => {
    const markAsRead = async () => {
      if (!currentUser?.NID || !logID) return;
      try {
        await axios.post(`${API_BASE_URL}/log/${logID}/read`, {
          readerNID: currentUser.NID,
        });
      } catch (error) {
        console.error("Error marking chat as read:", error);
      }
    };

    markAsRead();
  }, [currentUser, logID, messages.length]);

  // ดึงข้อมูลฟาร์ม
  useEffect(() => {
    const fetchFarmInfo = async () => {
      if (FID) {
        try {
          const response = await axios.get(
            `http://localhost:4000/farms/${FID}`
          );
          setFarmInfo(response.data);
        } catch (error) {
          console.error("Error fetching farm info:", error);
        }
      }
    };
    fetchFarmInfo();
  }, [FID]);

  // ดึงข้อความทั้งหมด
  useEffect(() => {
    const fetchMessages = async () => {
      if (logID) {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/log/${logID}`);
          setMessages(response.data || []);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
    
    // Auto refresh messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [logID]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ลดขนาดรูปภาพ
  const resizeImage = (file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // คำนวณขนาดใหม่ถ้ารูปใหญ่เกิน
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // สร้าง canvas และวาดรูปใหม่
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // แปลงเป็น base64
          const base64 = canvas.toDataURL(file.type, quality);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // แปลงไฟล์เป็น Base64 (ลดขนาดรูปภาพถ้าเป็นรูปภาพ)
  const convertFileToBase64 = async (file) => {
    // ถ้าเป็นรูปภาพ ให้ลดขนาดก่อน
    if (file.type.startsWith("image/")) {
      return await resizeImage(file);
    }
    
    // ถ้าไม่ใช่รูปภาพ ให้แปลงเป็น base64 ตามปกติ
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ตรวจสอบประเภทไฟล์
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "file";
  };

  // จัดการการเลือกไฟล์
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // จำกัดขนาดไฟล์ 10MB (ก่อน resize)
    if (file.size > 10 * 1024 * 1024) {
      alert("ไฟล์ขนาดเกิน 10MB กรุณาเลือกไฟล์ที่เล็กกว่า");
      return;
    }

    setSelectedFile(file);
    
    // สร้าง preview สำหรับรูปภาพ (ลดขนาดก่อนแสดง preview)
    if (file.type.startsWith("image/")) {
      try {
        const base64 = await convertFileToBase64(file);
        setFilePreview(base64);
      } catch (error) {
        console.error("Error processing image:", error);
        alert("เกิดข้อผิดพลาดในการประมวลผลรูปภาพ");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      setFilePreview(null);
    }
  };

  // ลบไฟล์ที่เลือก
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ส่งข้อความ
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!messageText.trim() && !selectedFile) || !logID || !currentUser) return;

    try {
      let imageData = null;
      let fileType = null;
      let fileName = null;

      // ถ้ามีไฟล์จากเครื่อง ให้ลดขนาดรูปภาพก่อนแปลงเป็น base64
      if (selectedFile) {
        imageData = await convertFileToBase64(selectedFile);
        fileType = getFileType(selectedFile);
        fileName = selectedFile.name;
      }

      await axios.post(`${API_BASE_URL}/message`, {
        logID,
        senderNID: currentUser.NID,
        messageText: messageText.trim() || "",
        image: imageData,
        fileType: fileType,
        fileName: fileName,
      });

      setMessageText("");
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh messages
      const response = await axios.get(`${API_BASE_URL}/log/${logID}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่");
    }
  };

  // ดึง bookmark products ของร้านนี้
  const fetchBookmarkProducts = async () => {
    if (!currentUser?.NID || !FID) return;
    setBookmarkLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/bookmarks/user/${currentUser.NID}/farm/${FID}`
      );
      setBookmarkProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching bookmark products:", error);
      setBookmarkProducts([]);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // เปิด popup bookmark
  const handleOpenBookmarkPopup = () => {
    setShowBookmarkPopup(true);
    fetchBookmarkProducts();
  };

  // ส่งสินค้าจาก bookmark เข้าแชท
  const handleSendBookmarkProduct = async (product) => {
    if (!currentUser?.NID || !logID || !product) return;

    try {
      const productMessage = `__PRODUCT__:${JSON.stringify({
        PID: product.PID,
        productName: product.productName,
        price: product.price,
        image: product.image,
        category: product.category,
        saleType: product.saleType,
        FID: product.FID,
      })}`;

      await axios.post(`${API_BASE_URL}/message`, {
        logID,
        senderNID: currentUser.NID,
        messageText: productMessage,
      });

      // ลบสินค้าออกจาก bookmark
      try {
        await axios.delete(
          `http://localhost:4000/bookmarks/remove/${currentUser.NID}/${product.PID}`
        );
        // อัปเดตรายการ bookmark โดยลบสินค้าที่ส่งแล้วออก
        setBookmarkProducts((prev) =>
          prev.filter((bookmark) => bookmark.Product?.PID !== product.PID)
        );
      } catch (bookmarkError) {
        console.error("Error removing bookmark:", bookmarkError);
        // ไม่ต้องแสดง error เพราะการส่งข้อความสำเร็จแล้ว
      }

      setShowBookmarkPopup(false);
      
      // Refresh messages
      const response = await axios.get(`${API_BASE_URL}/log/${logID}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error sending bookmark product:", error);
      alert("ไม่สามารถส่งสินค้าได้ กรุณาลองใหม่");
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `ส่งเมื่อ ${hours}:${minutes}`;
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    return `${day}/${month}/${year}`;
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((message) => {
      const messageDate = formatDate(message.timestamp);
      if (messageDate !== currentDate) {
        grouped.push({ type: "date", date: messageDate });
        currentDate = messageDate;
      }
      grouped.push({ type: "message", ...message });
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);
  const isUserMessage = (senderNID) => {
    return currentUser && senderNID === currentUser.NID;
  };
  const otherParticipantMessage = messages.find(
    (msg) => currentUser && msg.senderNID !== currentUser.NID
  );
  const fallbackCustomerName = otherParticipantMessage?.User?.username;
  const farmLocation = farmInfo?.Location
    ? `${farmInfo.Location.subDistrict || ""} ${
        farmInfo.Location.district || ""
      } ${farmInfo.Location.province || ""}`.trim()
    : "403/1 หมู่ 6 ต.วังผาง อ.เวียงหนองล่อง จ.ลำพูน";
  const headerTitle = isFarmer
    ? chatMeta?.targetName || fallbackCustomerName || "ลูกค้า"
    : farmInfo?.farmName || "โรงผักสร้างสุข";
  const headerSubtitle = isFarmer
    ? chatMeta?.subtitle ||
      (otherParticipantMessage
        ? `NID: ${otherParticipantMessage.senderNID}`
        : "ลูกค้าของคุณ")
    : farmLocation;

  if (!currentUser) {
    return (
      <div className={className}>
        <div style={{ padding: "50px", textAlign: "center" }}>
          <p>กรุณาเข้าสู่ระบบก่อน</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Chat Header */}
      <ChatHeader>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        <ProfileIcon>
          <FaUser />
        </ProfileIcon>
        <FarmInfo>
          <FarmName>{headerTitle}</FarmName>
          <FarmAddress>{headerSubtitle}</FarmAddress>
        </FarmInfo>
      </ChatHeader>

      {/* Messages Area */}
      <MessagesContainer>
        {highlightProduct && (
          <ProductCard>
            <ProductImage
              src={highlightProduct?.image || DEFAULT_PRODUCT_IMAGE}
              alt={highlightProduct?.productName || "สินค้า"}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
              }}
            />
            <ProductDetails>
              <ProductTitle>
                {highlightProduct?.productName || "สินค้าในตะกร้า"}
              </ProductTitle>
              <ProductMeta>
                {highlightProduct?.unit || "รายการ"} ·{" "}
                {highlightProduct?.quantity || 1} จำนวน
              </ProductMeta>
              <ProductPrice>
                ฿{highlightProduct?.price ?? "-"}
                <span>/ {highlightProduct?.unit || "หน่วย"}</span>
              </ProductPrice>
              <ProductActions>
                <ProductBadge>รายการสั่งซื้อ</ProductBadge>
                {highlightProduct?.PID && (
                  <ProductActionButton
                    type="button"
                    onClick={() => navigate(`/product/${highlightProduct.PID}`)}
                  >
                    ดูสินค้า
                  </ProductActionButton>
                )}
              </ProductActions>
            </ProductDetails>
          </ProductCard>
        )}
        {loading && messages.length === 0 ? (
          <LoadingText>กำลังโหลดข้อความ...</LoadingText>
        ) : groupedMessages.length === 0 ? (
          <EmptyState>ยังไม่มีข้อความ</EmptyState>
        ) : (
          groupedMessages.map((item, index) => {
            if (item.type === "date") {
              return <DateSeparator key={`date-${index}`}>{item.date}</DateSeparator>;
            }

            const isUser = isUserMessage(item.senderNID);
            
            // ตรวจสอบว่าข้อความเป็นข้อมูลสินค้าหรือไม่
            const isProductMessage = item.messageText?.startsWith("__PRODUCT__:");
            let productData = null;
            if (isProductMessage) {
              try {
                const productJson = item.messageText.replace("__PRODUCT__:", "");
                productData = JSON.parse(productJson);
              } catch (e) {
                console.error("Error parsing product data:", e);
              }
            }

            return (
              <MessageWrapper key={item.messageID || index} isUser={isUser}>
                {!isUser && <MessageIcon><FaUser /></MessageIcon>}
                <MessageBubble isUser={isUser}>
                  {isProductMessage && productData ? (
                    <ProductMessageCard isUser={isUser}>
                      <ProductMessageImage
                        src={productData.image || DEFAULT_PRODUCT_IMAGE}
                        alt={productData.productName}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                        }}
                      />
                      <ProductMessageDetails>
                        <ProductMessageTitle isUser={isUser}>{productData.productName}</ProductMessageTitle>
                        <ProductMessagePrice isUser={isUser}>฿{productData.price || "-"}</ProductMessagePrice>
                        <ProductMessageCategory isUser={isUser}>{productData.category || ""}</ProductMessageCategory>
                        {productData.PID && (
                          <ProductMessageButton
                            type="button"
                            isUser={isUser}
                            onClick={() => navigate(`/product/${productData.PID}`)}
                          >
                            ดูสินค้า
                          </ProductMessageButton>
                        )}
                      </ProductMessageDetails>
                    </ProductMessageCard>
                  ) : (
                    <>
                      {item.image && item.fileType === "image" && (
                        <MessageImage src={item.image} alt="Message attachment" />
                      )}
                      {item.image && item.fileType === "video" && (
                        <MessageVideo controls>
                          <source src={item.image} type="video/mp4" />
                          <source src={item.image} type="video/webm" />
                          Your browser does not support the video tag.
                        </MessageVideo>
                      )}
                      {item.image && item.fileType === "file" && (
                        <MessageFileContainer isUser={isUser}>
                          <MessageFileIcon>📎</MessageFileIcon>
                          <MessageFileName isUser={isUser}>{item.fileName || "ไฟล์"}</MessageFileName>
                          <MessageFileDownload
                            href={item.image}
                            download={item.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            isUser={isUser}
                          >
                            ดาวน์โหลด
                          </MessageFileDownload>
                        </MessageFileContainer>
                      )}
                      {item.messageText && (
                        <MessageText>{item.messageText}</MessageText>
                      )}
                    </>
                  )}
                  <MessageTime>{formatTime(item.timestamp)}</MessageTime>
                </MessageBubble>
              </MessageWrapper>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* File Preview */}
      {selectedFile && (
        <FilePreviewContainer>
          {filePreview ? (
            <FilePreviewImage src={filePreview} alt="Preview" />
          ) : (
            <FilePreviewIcon>
              📎 {selectedFile.name}
            </FilePreviewIcon>
          )}
          <RemoveFileButton type="button" onClick={handleRemoveFile}>
            ✕
          </RemoveFileButton>
        </FilePreviewContainer>
      )}

      {/* Input Bar */}
      <InputContainer onSubmit={handleSendMessage}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          style={{ display: "none" }}
        />
        <AttachButton type="button" onClick={() => fileInputRef.current?.click()}>
          <FaImage />
        </AttachButton>
        {!isFarmer && FID && (
          <BookmarkButton type="button" onClick={handleOpenBookmarkPopup}>
            <FaBookmark />
          </BookmarkButton>
        )}
        <InputField
          type="text"
          placeholder="ป้อนข้อความ"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <SendButton type="submit" disabled={!messageText.trim() && !selectedFile}>
          <FaPaperPlane />
        </SendButton>
      </InputContainer>

      {/* Bookmark Popup */}
      {showBookmarkPopup && (
        <BookmarkPopupOverlay onClick={() => setShowBookmarkPopup(false)}>
          <BookmarkPopupContent onClick={(e) => e.stopPropagation()}>
            <BookmarkPopupHeader>
              <h3>เลือกสินค้าจากบุ๊กมาร์ก</h3>
              <CloseButton type="button" onClick={() => setShowBookmarkPopup(false)}>
                <FaTimes />
              </CloseButton>
            </BookmarkPopupHeader>
            <BookmarkPopupBody>
              {bookmarkLoading ? (
                <LoadingText>กำลังโหลด...</LoadingText>
              ) : bookmarkProducts.length === 0 ? (
                <EmptyState>ยังไม่มีสินค้าในบุ๊กมาร์กของร้านนี้</EmptyState>
              ) : (
                <BookmarkProductsList>
                  {bookmarkProducts.map((bookmark) => {
                    const product = bookmark.Product;
                    if (!product) return null;
                    return (
                      <BookmarkProductItem
                        key={bookmark.id}
                        onClick={() => handleSendBookmarkProduct(product)}
                      >
                        <BookmarkProductImage
                          src={product.image || DEFAULT_PRODUCT_IMAGE}
                          alt={product.productName}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                        />
                        <BookmarkProductInfo>
                          <BookmarkProductName>{product.productName}</BookmarkProductName>
                          <BookmarkProductPrice>฿{product.price || "-"}</BookmarkProductPrice>
                        </BookmarkProductInfo>
                      </BookmarkProductItem>
                    );
                  })}
                </BookmarkProductsList>
              )}
            </BookmarkPopupBody>
          </BookmarkPopupContent>
        </BookmarkPopupOverlay>
      )}
    </div>
  );
};

export default styled(ChatPage)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  font-family: "Prompt", sans-serif;
`;

/* Chat Header */
const ChatHeader = styled.div`
  background: #2baa00;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    font-size: 18px;
  }
`;

const ProfileIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid white;

  svg {
    font-size: 20px;
  }
`;

const FarmInfo = styled.div`
  flex: 1;
  color: white;
`;

const FarmName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const FarmAddress = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

/* Messages Container */
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 15px;
  background: #ffffff;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }

  &::-webkit-scrollbar-thumb {
    background: #2baa00;
    border-radius: 3px;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: #888;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #888;
  padding: 40px 20px;
`;

const DateSeparator = styled.div`
  text-align: center;
  color: #888;
  font-size: 12px;
  margin: 20px 0;
  padding: 8px 0;
`;

const ProductCard = styled.div`
  display: flex;
  gap: 15px;
  padding: 16px;
  border-radius: 18px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  margin-bottom: 20px;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #14532d;
`;

const ProductMeta = styled.div`
  font-size: 13px;
  color: #479f63;
`;

const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #166534;

  span {
    font-size: 13px;
    color: #479f63;
    margin-left: 6px;
    font-weight: 500;
  }
`;

const ProductActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ProductBadge = styled.span`
  background: #d9f99d;
  color: #365314;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

const ProductActionButton = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  background: #22c55e;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #16a34a;
  }
`;

const ProductMessageCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: ${(props) => (props.isUser ? "rgba(255,255,255,0.2)" : "#f0fdf4")};
  border: 1px solid ${(props) => (props.isUser ? "rgba(255,255,255,0.3)" : "#bbf7d0")};
  max-width: 300px;
`;

const ProductMessageImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProductMessageDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductMessageTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.isUser ? "white" : "#14532d")};
  line-height: 1.3;
`;

const ProductMessagePrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.isUser ? "white" : "#166534")};
`;

const ProductMessageCategory = styled.div`
  font-size: 11px;
  color: ${(props) => (props.isUser ? "rgba(255,255,255,0.8)" : "#479f63")};
`;

const ProductMessageButton = styled.button`
  margin-top: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: ${(props) => (props.isUser ? "rgba(255,255,255,0.3)" : "#22c55e")};
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;

  &:hover {
    background: ${(props) => (props.isUser ? "rgba(255,255,255,0.4)" : "#16a34a")};
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
`;

const MessageIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  flex-shrink: 0;

  svg {
    font-size: 14px;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${(props) => (props.isUser ? "#2baa00" : "#e8f5e9")};
  color: ${(props) => (props.isUser ? "white" : "#333")};
  word-wrap: break-word;
  position: relative;
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 6px;
`;

const MessageImage = styled.img`
  width: 100%;
  max-width: 250px;
  border-radius: 8px;
  margin: 8px 0;
  object-fit: cover;
`;

const MessageTime = styled.div`
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
`;

/* Input Container */
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  position: sticky;
  bottom: 0;
`;

const AttachButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #2baa00;
  }

  svg {
    font-size: 20px;
  }
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  font-family: "Prompt", sans-serif;

  &:focus {
    border-color: #2baa00;
  }

  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background: ${(props) => (props.disabled ? "#ccc" : "#2baa00")};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #228800;
  }

  svg {
    font-size: 16px;
  }
`;

const BookmarkButton = styled.button`
  background: #f59e0b;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #d97706;
  }

  svg {
    font-size: 16px;
  }
`;

const BookmarkPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const BookmarkPopupContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const BookmarkPopupHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    color: #1f2937;
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const BookmarkPopupBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const BookmarkProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BookmarkProductItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #22c55e;
  }
`;

const BookmarkProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const BookmarkProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BookmarkProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
`;

const BookmarkProductPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #166534;
`;

const FilePreviewContainer = styled.div`
  position: relative;
  padding: 12px;
  background: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilePreviewImage = styled.img`
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
`;

const FilePreviewIcon = styled.div`
  padding: 12px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RemoveFileButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const MessageVideo = styled.video`
  max-width: 300px;
  max-height: 300px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const MessageFileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${(props) => (props.isUser ? "rgba(255,255,255,0.2)" : "#f0fdf4")};
  border-radius: 8px;
  margin-bottom: 8px;
  max-width: 300px;
`;

const MessageFileIcon = styled.span`
  font-size: 24px;
`;

const MessageFileName = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${(props) => (props.isUser ? "white" : "#1f2937")};
  word-break: break-word;
`;

const MessageFileDownload = styled.a`
  padding: 6px 12px;
  background: ${(props) => (props.isUser ? "rgba(255,255,255,0.3)" : "#22c55e")};
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.isUser ? "rgba(255,255,255,0.4)" : "#16a34a")};
  }
`;
