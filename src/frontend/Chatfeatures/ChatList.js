import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSearch } from "react-icons/fa";

const API_BASE_URL = "http://localhost:4000/chats";

const ChatList = ({ className }) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ดึงข้อมูล user จาก localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // ดึงรายการ chat ทั้งหมด
  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser?.NID) {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/${currentUser.NID}`);
          setChats(response.data || []);
        } catch (error) {
          console.error("Error fetching chats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChats();
    
    // Auto refresh every 5 seconds
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Filter chats by search term
  const filteredChats = chats.filter((chat) =>
    chat.Farm?.farmName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Header */}
      <Header>
        <Title>ข้อความ</Title>
      </Header>

      {/* Search Bar */}
      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="ค้นหาฟาร์ม..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      {/* Chat List */}
      <ChatListContainer>
        {loading && chats.length === 0 ? (
          <LoadingText>กำลังโหลด...</LoadingText>
        ) : filteredChats.length === 0 ? (
          <EmptyState>
            {searchTerm ? "ไม่พบฟาร์มที่ค้นหา" : "ยังไม่มีข้อความ"}
          </EmptyState>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.logID}
              onClick={() => navigate(`/chat/${chat.logID}/${chat.FID}`)}
            >
              <ChatIcon>
                <FaUser />
              </ChatIcon>
              <ChatInfo>
                <ChatName>{chat.Farm?.farmName || "ฟาร์ม"}</ChatName>
                <ChatPreview>คลิกเพื่อดูข้อความ</ChatPreview>
              </ChatInfo>
              <ChatArrow>›</ChatArrow>
            </ChatItem>
          ))
        )}
      </ChatListContainer>
    </div>
  );
};

export default styled(ChatList)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  font-family: "Prompt", sans-serif;
`;

const Header = styled.div`
  background: #2baa00;
  padding: 20px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
`;

const SearchIcon = styled.div`
  color: #888;
  margin-right: 10px;
  
  svg {
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  font-family: "Prompt", sans-serif;

  &::placeholder {
    color: #999;
  }
`;

const ChatListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #888;
  padding: 40px 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #888;
  padding: 60px 20px;
  font-size: 16px;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }

  &:active {
    background: #f0f0f0;
  }
`;

const ChatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2baa00;
  margin-right: 15px;
  flex-shrink: 0;

  svg {
    font-size: 24px;
  }
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ChatPreview = styled.div`
  font-size: 14px;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatArrow = styled.div`
  color: #ccc;
  font-size: 24px;
  margin-left: 10px;
`;

