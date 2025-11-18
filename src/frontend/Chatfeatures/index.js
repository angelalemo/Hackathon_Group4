import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaPaperPlane, FaImage } from "react-icons/fa";

const API_BASE_URL = "http://localhost:4000/chats";

const ChatPage = ({ className }) => {
  const { logID, FID } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [farmInfo, setFarmInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ดึงข้อมูล user จาก localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // ดึงข้อมูลฟาร์ม
  useEffect(() => {
    const fetchFarmInfo = async () => {
      if (FID) {
        try {
          const response = await axios.get(`http://localhost:4000/farms/${FID}`);
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

  // ส่งข้อความ
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !logID || !currentUser) return;

    try {
      await axios.post(`${API_BASE_URL}/message`, {
        logID: parseInt(logID),
        senderNID: currentUser.NID,
        messageText: messageText.trim(),
      });

      setMessageText("");
      
      // Refresh messages
      const response = await axios.get(`${API_BASE_URL}/log/${logID}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่");
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
          <FarmName>{farmInfo?.farmName || "โรงผักสร้างสุข"}</FarmName>
          <FarmAddress>
            {farmInfo?.Location
              ? `${farmInfo.Location.subDistrict || ""} ${farmInfo.Location.district || ""} ${farmInfo.Location.province || ""}`
              : "403/1 หมู่ 6 ต.วังผาง อ.เวียงหนองล่อง จ.ลำพูน"}
          </FarmAddress>
        </FarmInfo>
      </ChatHeader>

      {/* Messages Area */}
      <MessagesContainer>
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
            return (
              <MessageWrapper key={item.MID || index} isUser={isUser}>
                {!isUser && <MessageIcon><FaUser /></MessageIcon>}
                <MessageBubble isUser={isUser}>
                  <MessageText>{item.messageText}</MessageText>
                  {item.image && (
                    <MessageImage src={item.image} alt="Message attachment" />
                  )}
                  <MessageTime>{formatTime(item.timestamp)}</MessageTime>
                </MessageBubble>
              </MessageWrapper>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* Input Bar */}
      <InputContainer onSubmit={handleSendMessage}>
        <AttachButton type="button">
          <FaImage />
        </AttachButton>
        <InputField
          type="text"
          placeholder="ป้อนข้อความ"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <SendButton type="submit" disabled={!messageText.trim()}>
          <FaPaperPlane />
        </SendButton>
      </InputContainer>
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
