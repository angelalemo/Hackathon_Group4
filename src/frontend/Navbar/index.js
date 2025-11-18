import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  Menu,
  MessageSquare,
  BookOpen,
  Search,
  ChevronDown,
  X,
  Bell,
  Bookmark,
  Package,
  User,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ className, onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [showBellPopup, setShowBellPopup] = useState(false);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);
  const [filterValues, setFilterValues] = useState({
    productCategory: "",
    province: "",
    district: "",
    subDistrict: "",
  });
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    provinces: [],
    districts: [],
    subDistricts: [],
  });

  const bellRef = useRef(null);
  const bookmarkRef = useRef(null);

  const overlayRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:4000";

  // ตรวจสอบ user จาก localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser.user || parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBellPopup(false);
      }
      if (bookmarkRef.current && !bookmarkRef.current.contains(e.target)) {
        setShowBookmarkPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ปิด sidebar เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        const menuButton = event.target.closest(".menu-icon");
        if (!menuButton) setShowSidebar(false);
      }
    };
    if (showSidebar) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSidebar]);

  // ปิด overlay เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSearchOverlay &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target)
      ) {
        const searchButton = event.target.closest(".search-icon-button");
        if (!searchButton) setShowSearchOverlay(false);
      }
    };
    if (showSearchOverlay)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchOverlay]);

  // ดึง options สำหรับ filter
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/farms/AllwithProducts`
        );
        const farms = response.data || [];

        const categories = [
          ...new Set(
            farms.flatMap((farm) =>
              (farm.Products || []).map((p) => p.category).filter(Boolean)
            )
          ),
        ];
        const provinces = [
          ...new Set(farms.map((farm) => farm.province).filter(Boolean)),
        ];
        const districts = [
          ...new Set(farms.map((farm) => farm.district).filter(Boolean)),
        ];
        const subDistricts = [
          ...new Set(farms.map((farm) => farm.subDistrict).filter(Boolean)),
        ];

        setFilterOptions({
          categories: categories.sort(),
          provinces: provinces.sort(),
          districts: districts.sort(),
          subDistricts: subDistricts.sort(),
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  // เรียก API เมื่อมีการเปลี่ยนแปลง filter หรือ search
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const params = { page: 1, limit: 20 };
        if (searchQuery) {
          params.productName = searchQuery;
          params.farmName = searchQuery;
        }
        if (selectedFilter === "ชนิดผัก" && filterValues.productCategory)
          params.productCategory = filterValues.productCategory;
        if (selectedFilter === "จังหวัด" && filterValues.province)
          params.province = filterValues.province;
        if (selectedFilter === "อำเภอ" && filterValues.district)
          params.district = filterValues.district;
        if (selectedFilter === "ตำบล" && filterValues.subDistrict)
          params.subDistrict = filterValues.subDistrict;

        const response = await axios.get(`${API_BASE_URL}/farms/All`, {
          params,
        });
        if (onFilterChange) onFilterChange(response.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (showSearchOverlay) fetchFilteredData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedFilter,
    filterValues,
    onFilterChange,
    showSearchOverlay,
  ]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // พิมพ์แล้วไปหน้า filter โดยส่ง query ไปด้วย
    if (value.trim().length > 0) {
      navigate(`/filter?search=${value}`);
    }
  };

  const handleFilterClick = (filterId) =>
    setSelectedFilter((prev) => (prev === filterId ? null : filterId));

  const handleFilterValueChange = (value) => {
    setFilterValues((prev) => {
      const newValues = {
        productCategory: "",
        province: "",
        district: "",
        subDistrict: "",
      };
      if (selectedFilter === "ชนิดผัก") newValues.productCategory = value;
      if (selectedFilter === "จังหวัด") newValues.province = value;
      if (selectedFilter === "อำเภอ") newValues.district = value;
      if (selectedFilter === "ตำบล") newValues.subDistrict = value;
      return { ...prev, ...newValues };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowSidebar(false);
    navigate("/");
  };

  const getCurrentOptions = () => {
    switch (selectedFilter) {
      case "ชนิดผัก":
        return filterOptions.categories;
      case "จังหวัด":
        return filterOptions.provinces;
      case "อำเภอ":
        return filterOptions.districts;
      case "ตำบล":
        return filterOptions.subDistricts;
      default:
        return [];
    }
  };

  const getCurrentValue = () => {
    switch (selectedFilter) {
      case "ชนิดผัก":
        return filterValues.productCategory;
      case "จังหวัด":
        return filterValues.province;
      case "อำเภอ":
        return filterValues.district;
      case "ตำบล":
        return filterValues.subDistrict;
      default:
        return "";
    }
  };

  const filters = [
    { id: "ชนิดผัก", label: "ชนิดผัก" },
    { id: "ตำบล", label: "ตำบล" },
    { id: "อำเภอ", label: "อำเภอ" },
    { id: "จังหวัด", label: "จังหวัด" },
  ];

  const isFarmer = user && (user.type === "Farmer" || user.type === true);

  return (
    <div className={className}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="left-section">
            <button
              className="menu-icon"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu size={24} />
            </button>
            <h1 className="logo">Phaktae</h1>
          </div>
          <div className="right-section">
            {/* Search */}
            <button
              className="icon-button search-icon-button"
              onClick={() => setShowSearchOverlay(!showSearchOverlay)}
            >
              <Search size={24} />
            </button>

            {/* Bell Popup */}
            <div className="popup-wrapper" ref={bellRef}>
              <button
                className="icon-button"
                onClick={() => {
                  setShowBellPopup(!showBellPopup);
                  setShowBookmarkPopup(false); // ปิดอันอื่น
                }}
              >
                <Bell size={24} />
              </button>

              {showBellPopup && (
                <div className="popup-box">
                  <h4>การแจ้งเตือน</h4>
                  <p>ยังไม่มีการแจ้งเตือน</p>
                </div>
              )}
            </div>

            {/* Bookmark Popup */}
            <div className="popup-wrapper" ref={bookmarkRef}>
              <button
                className="icon-button"
                onClick={() => {
                  setShowBookmarkPopup(!showBookmarkPopup);
                  setShowBellPopup(false);
                }}
              >
                <Bookmark size={24} />
              </button>

              {showBookmarkPopup && (
                <div className="popup-box">
                  <h4>บุ๊กมาร์ก</h4>
                  <p>ยังไม่มีรายการที่บันทึก</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <>
          <div
            className="sidebar-backdrop"
            onClick={() => setShowSidebar(false)}
          />
          <div className="sidebar" ref={sidebarRef}>
            <div className="sidebar-header">
              <h1 className="sidebar-logo">Phaktae</h1>
              <button
                className="sidebar-close"
                onClick={() => setShowSidebar(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="sidebar-content">
              {!user ? (
                <div className="sidebar-auth">
                  <Link
                    to="/login"
                    className="sidebar-login-button"
                    onClick={() => setShowSidebar(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/register"
                    className="sidebar-register-button"
                    onClick={() => setShowSidebar(false)}
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              ) : (
                <>
                  <div className="user-profile-box">
                    <div className="user-avatar">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="user-details">
                      <span className="user-profile-name">{user.username}</span>
                      <span className="user-profile-role">
                        {user.type || "User"}
                      </span>
                    </div>
                  </div>

                  {isFarmer ? (
                    <div className="sidebar-menu">
                      <Link
                        to="/createfarm"
                        className="sidebar-menu-item"
                        onClick={() => setShowSidebar(false)}
                      >
                        <User size={20} />
                        <span>หน้าโปรไฟล์</span>
                      </Link>
                      <Link
                        to="/chat"
                        className="sidebar-menu-item"
                        onClick={() => setShowSidebar(false)}
                      >
                        <MessageSquare size={20} />
                        <span>แชทลูกค้า</span>
                      </Link>
                      <Link
                        to="/product-management"
                        className="sidebar-menu-item"
                        onClick={() => setShowSidebar(false)}
                      >
                        <Package size={20} />
                        <span>คลังสินค้า</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="sidebar-menu">
                      <Link
                        to="/chat-history"
                        className="sidebar-menu-item"
                        onClick={() => setShowSidebar(false)}
                      >
                        <MessageSquare size={20} />
                        <span>ประวัติการแชท</span>
                      </Link>
                      <Link
                        to="/notifications"
                        className="sidebar-menu-item"
                        onClick={() => setShowSidebar(false)}
                      >
                        <Bell size={20} />
                        <span>การแจ้งเตือน</span>
                      </Link>
                      <Link
                        to="/bookmarks"
                        className="sidebar-menu-item"
                        onClick={() => setShowSidebar(false)}
                      >
                        <Bookmark size={20} />
                        <span>บุ๊กมาร์ก</span>
                      </Link>
                    </div>
                  )}

                  <button className="sidebar-logout" onClick={handleLogout}>
                    ออกจากระบบ
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Search Overlay */}
      {showSearchOverlay && (
        <>
          <div
            className="overlay-backdrop"
            onClick={() => setShowSearchOverlay(false)}
          />
          <div className="search-overlay" ref={overlayRef}>
            <div className="overlay-content">
              <div className="search-section">
                <div className="search-container">
                  <div className="search-icon">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                </div>
              </div>

              <div className="category-section">
                <span className="category-label">หมวดหมู่</span>
                <div className="filter-buttons">
                  {filters.map((filter) => (
                    <div key={filter.id} className="filter-wrapper">
                      <button
                        className={`filter-button ${
                          selectedFilter === filter.id ? "selected" : ""
                        }`}
                        onClick={() => handleFilterClick(filter.id)}
                      >
                        {filter.label} <ChevronDown size={16} />
                      </button>
                      {selectedFilter === filter.id && (
                        <div className="filter-dropdown">
                          <select
                            className="filter-select"
                            value={getCurrentValue()}
                            onChange={(e) =>
                              handleFilterValueChange(e.target.value)
                            }
                          >
                            <option value="">เลือก{filter.label}</option>
                            {getCurrentOptions().map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default styled(Navbar)`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;

  /* Header */
  .header {
    background-color: #ffffff;
    padding: 10px 20px;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
    z-index: 300;
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .menu-icon {
    background: none;
    border: none;
    cursor: pointer;
    color: #000000;
    display: flex;
    align-items: center;
    padding: 4px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  .logo {
    font-size: 28px;
    font-weight: bold;
    color: #22c55e;
    margin: 0;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #000000;
    display: flex;
    align-items: center;
    padding: 4px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  .auth-buttons {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .login-button,
  .register-button {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
  }

  .login-button {
    color: #1f2937;
    background: transparent;
    border: 1px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
      border-color: #22c55e;
      color: #22c55e;
    }
  }

  .register-button {
    color: #ffffff;
    background: #22c55e;
    border: 1px solid #22c55e;

    &:hover {
      background: #16a34a;
      border-color: #16a34a;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }

  .user-role {
    font-size: 12px;
    color: #6b7280;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 4px;
  }

  .logout-button {
    padding: 6px 12px;
    font-size: 12px;
    color: #ef4444;
    background: transparent;
    border: 1px solid #ef4444;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #ef4444;
      color: #ffffff;
    }
  }

  /* Sidebar */
  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 399;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: #ffffff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 400;
    transform: translateX(0);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
  }

  .sidebar-logo {
    font-size: 24px;
    font-weight: bold;
    color: #22c55e;
    margin: 0;
  }

  .sidebar-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    display: flex;
    align-items: center;
    padding: 4px;
    transition: all 0.2s;
    border-radius: 4px;

    &:hover {
      color: #1f2937;
      background: #f9fafb;
    }
  }

  .sidebar-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
    overflow-y: auto;
  }

  .sidebar-auth {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }

  .sidebar-login-button,
  .sidebar-register-button {
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
    cursor: pointer;
  }

  .sidebar-login-button {
    color: #1f2937;
    background: transparent;
    border: 2px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
      border-color: #22c55e;
      color: #22c55e;
    }
  }

  .sidebar-register-button {
    color: #ffffff;
    background: #22c55e;
    border: 2px solid #22c55e;

    &:hover {
      background: #16a34a;
      border-color: #16a34a;
    }
  }

  .user-profile-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 12px;
    border: 2px solid #e5e7eb;
  }

  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #22c55e;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    flex-shrink: 0;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .user-profile-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .user-profile-role {
    font-size: 13px;
    color: #6b7280;
  }

  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sidebar-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    text-decoration: none;
    color: #1f2937;
    font-size: 15px;
    transition: all 0.2s;
    cursor: pointer;

    svg {
      color: #6b7280;
    }

    &:hover {
      background: #f9fafb;
      color: #22c55e;

      svg {
        color: #22c55e;
      }
    }
  }

  .sidebar-logout {
    margin-top: auto;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #ef4444;
    background: transparent;
    border: 2px solid #ef4444;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #ef4444;
      color: #ffffff;
    }
  }

  /* Overlay Backdrop */
  .overlay-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 199;
  }

  /* Search Overlay */
  .search-overlay {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 200;
  }

  .overlay-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
  }

  /* Search Bar */
  .search-section {
    padding: 12px 0;
    background-color: #ffffff;
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    color: #6b7280;
    pointer-events: none;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 12px 16px 12px 48px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    font-size: 15px;
    background-color: #f9fafb;
    color: #1f2937;
    transition: all 0.2s;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #22c55e;
      background-color: #ffffff;
    }
  }

  /* Category Filters */
  .category-section {
    padding: 12px 0;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .category-label {
    font-size: 15px;
    color: #1f2937;
    font-weight: 500;
  }

  .filter-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .filter-wrapper {
    position: relative;
  }

  .filter-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 24px;
    background-color: #ffffff;
    color: #1f2937;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      color: #000000;
    }

    &:hover {
      border-color: #9ca3af;
      background-color: #f9fafb;
    }

    &.selected {
      border-color: #000000;
      font-weight: 600;

      &:hover {
        border-color: #000000;
        background-color: #ffffff;
      }
    }
  }

  .filter-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 10;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 200px;
  }

  .filter-select {
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    background-color: #ffffff;
    color: #1f2937;
    cursor: pointer;
    outline: none;

    &:focus {
      outline: 2px solid #22c55e;
      outline-offset: -2px;
    }
  }

  /* Desktop Responsive */
  @media (min-width: 768px) {
    .header {
      padding: 12px 24px;
    }

    .left-section {
      gap: 16px;
    }

    .logo {
      font-size: 32px;
    }

    .right-section {
      gap: 16px;
    }

    .auth-buttons {
      gap: 14px;
    }

    .login-button,
    .register-button {
      padding: 10px 20px;
      font-size: 15px;
    }

    .user-name {
      font-size: 15px;
    }

    .user-role {
      font-size: 13px;
      padding: 5px 10px;
    }

    .sidebar {
      width: 320px;
    }

    .sidebar-header {
      padding: 18px 24px;
    }

    .sidebar-logo {
      font-size: 26px;
    }

    .overlay-content {
      padding: 24px;
    }

    .search-section {
      padding: 16px 0;
    }

    .search-input {
      padding: 13px 18px 13px 52px;
      font-size: 16px;
      border-radius: 14px;
    }

    .category-section {
      padding: 16px 0;
      gap: 16px;
    }

    .category-label {
      font-size: 16px;
    }

    .filter-buttons {
      gap: 12px;
    }

    .filter-button {
      padding: 9px 18px;
      font-size: 15px;
      border-radius: 26px;
    }
  }

  @media (min-width: 1024px) {
    .header {
      padding: 14px 32px;
    }

    .logo {
      font-size: 36px;
    }

    .sidebar {
      width: 360px;
    }

    .sidebar-header {
      padding: 20px 32px;
    }

    .sidebar-logo {
      font-size: 28px;
    }

    .overlay-content {
      padding: 32px;
    }

    .search-input {
      padding: 14px 20px 14px 56px;
      font-size: 17px;
      border-radius: 16px;
    }

    .category-section {
      gap: 18px;
    }

    .category-label {
      font-size: 17px;
    }

    .filter-button {
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 28px;
    }
  }

  /* Popup Wrapper */
  .popup-wrapper {
    position: relative;
    display: inline-block;
  }

  /* Popup Box */
  .popup-box {
    position: absolute;
    top: 36px;
    right: 0;
    width: 240px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
    z-index: 999;
  }

  .popup-box h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }

  .popup-box p {
    font-size: 13px;
    color: #6b7280;
  }
`;
