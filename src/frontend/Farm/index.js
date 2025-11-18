import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000";

const FarmProfile = ({ className }) => {
  const { farmID } = useParams(); // ดึง FID จาก URL
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [productsModalLoading, setProductsModalLoading] = useState(false);
  const [productsModalError, setProductsModalError] = useState("");
  const [farmProducts, setFarmProducts] = useState([]);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editContact, setEditContact] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const storedUser = localStorage.getItem("user");
  let farmerNID = "";
  let currentUser = null;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      currentUser = parsed.user || parsed;
      farmerNID = currentUser?.NID || "";
    } catch (err) {
      console.error("Failed to parse user from storage", err);
    }
  }

  // ตรวจสอบว่า user เป็นเจ้าของฟาร์มหรือไม่
  const isOwner = farm && currentUser && (
    (currentUser.type === "Farmer" || currentUser.type === true) && 
    farm.NID === farmerNID
  );

  // Default farmer image
  const defaultFarmerImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23667eea' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='80' fill='white'%3E🧑‍🌾%3C/text%3E%3C/svg%3E";

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        setLoading(true);
        let endpoint = "";
        if (farmID) {
          endpoint = `${API_BASE_URL}/farms/${farmID}`;
        } else if (farmerNID) {
          endpoint = `${API_BASE_URL}/farms/user/${farmerNID}`;
        } else {
          setFarm(null);
          setLoading(false);
          return;
        }

        const res = await axios.get(endpoint);
        if (Array.isArray(res.data) && res.data.length > 0) {
          // some endpoints might return array
          setFarm(res.data[0]);
        } else {
          setFarm(res.data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchFarm();
  }, [farmID, farmerNID]);

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
    // ตรวจสอบว่า user เป็น Farmer หรือไม่
    const isFarmer = currentUser && (currentUser.type === "Farmer" || currentUser.type === true);
    
    return (
      <div className={className}>
        <div className="error-container">
          <div className="error-icon">{isFarmer ? "🌾" : "😢"}</div>
          <h2>{isFarmer ? "คุณยังไม่มีฟาร์ม" : "ไม่พบข้อมูลฟาร์ม"}</h2>
          {isFarmer ? (
            <>
              <p style={{ marginBottom: "20px", color: "#666" }}>
                เริ่มต้นสร้างฟาร์มของคุณเพื่อเริ่มขายสินค้า
              </p>
              <Link to="/createfarm" className="back-btn" style={{ background: "#22c55e" }}>
                ➕ สร้างฟาร์ม
              </Link>
              <Link to="/" className="back-btn" style={{ marginTop: "10px", background: "#667eea" }}>
                กลับหน้าหลัก
              </Link>
            </>
          ) : (
            <Link to="/" className="back-btn">กลับหน้าหลัก</Link>
          )}
        </div>
      </div>
    );
  }

  const images = farm.Storages?.filter(s => s.typeStorage === "image") || [];
  const videos = farm.Storages?.filter(s => s.typeStorage === "video") || [];

  const getCertificateType = (file) => {
    if (!file || typeof file !== "string") return "unknown";
    const lower = file.toLowerCase();
    if (lower.includes("application/pdf") || lower.endsWith(".pdf")) return "pdf";
    return "image";
  };

  const handleViewCertificate = (cert) => {
    if (!cert?.file) return;
    setSelectedCertificate(cert);
    setIsCertificateModalOpen(true);
  };

  const closeCertificateModal = () => {
    setSelectedCertificate(null);
    setIsCertificateModalOpen(false);
  };

  const fetchFarmProducts = async () => {
    if (!farm?.FID) return;
    setProductsModalLoading(true);
    setProductsModalError("");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/farms/${farm.FID}/products`
      );
      const products =
        res.data?.Products ||
        res.data?.products ||
        res.data?.FarmProducts ||
        [];
      setFarmProducts(products);
    } catch (error) {
      console.error("Error fetching farm products:", error);
      setProductsModalError("ไม่สามารถโหลดสินค้าของฟาร์มได้");
    } finally {
      setProductsModalLoading(false);
    }
  };

  const openProductsModal = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsProductsModalOpen(true);
    if (farmProducts.length === 0) {
      await fetchFarmProducts();
    }
  };

  const closeProductsModal = () => {
    setIsProductsModalOpen(false);
  };

  // เปิด/ปิด edit mode สำหรับ description
  const handleToggleEditDescription = () => {
    if (!isOwner) {
      alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }
    if (!isEditingDescription) {
      setEditDescription(farm.description || "");
    }
    setIsEditingDescription(!isEditingDescription);
  };

  // เปิด/ปิด edit mode สำหรับ contact
  const handleToggleEditContact = () => {
    if (!isOwner) {
      alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }
    if (!isEditingContact) {
      setEditContact({
        farmName: farm.farmName || "",
        email: farm.email || "",
        phoneNumber: farm.phoneNumber || "",
        location: farm.location || "",
        province: farm.province || "",
        district: farm.district || "",
        subDistrict: farm.subDistrict || "",
        line: farm.line || "",
        facebook: farm.facebook || "",
      });
    }
    setIsEditingContact(!isEditingContact);
  };

  // อัปเดตรายละเอียดฟาร์ม
  const handleUpdateDescription = async () => {
    if (!farm?.FID || !farmerNID || !isOwner) {
      alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/farms/updateInfo`, {
        NID: farmerNID,
        FID: farm.FID,
        description: editDescription,
      });

      // Refresh ข้อมูลฟาร์ม
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      setIsEditingDescription(false);
      alert("อัปเดตรายละเอียดสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  // อัปเดตข้อมูลติดต่อ
  const handleUpdateContact = async () => {
    if (!farm?.FID || !farmerNID || !isOwner) {
      alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/farms/updateInfo`, {
        NID: farmerNID,
        FID: farm.FID,
        ...editContact,
      });

      // Refresh ข้อมูลฟาร์ม
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      setIsEditingContact(false);
      alert("อัปเดตข้อมูลติดต่อสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  // แปลงไฟล์เป็น Base64
  const toBase64Image = (file, maxWidth = 500, maxHeight = 500, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

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

  // อัปโหลดรูปโปรไฟล์ฟาร์ม
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !farm?.FID || !farmerNID || !isOwner) {
      if (!isOwner) alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }

    try {
      const base64 = await toBase64Image(file);
      await axios.put(`${API_BASE_URL}/farms/profileImage`, {
        NID: farmerNID,
        FID: farm.FID,
        profileImage: base64,
      });

      // Refresh ข้อมูลฟาร์ม
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      alert("อัปโหลดรูปโปรไฟล์ฟาร์มสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปโปรไฟล์ฟาร์ม");
    }
  };

  // อัปโหลดรูปโปรไฟล์เกษตรกร
  const handleUserProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !farmerNID || !isOwner) {
      if (!isOwner) alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }

    try {
      const base64 = await toBase64Image(file);
      await axios.put(`${API_BASE_URL}/users/profileImage`, {
        NID: farmerNID,
        profileImage: base64,
      });

      // Refresh ข้อมูลฟาร์มเพื่อให้เห็นรูปโปรไฟล์ใหม่
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      alert("อัปโหลดรูปโปรไฟล์เกษตรกรสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปโปรไฟล์เกษตรกร");
    }
  };

  // เพิ่มรูป/วิดีโอ
  const handleAddStorage = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !farm?.FID || !farmerNID || !isOwner) {
      if (!isOwner) alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }

    try {
      const storages = await Promise.all(
        files.map(async (file) => {
          const base64 = await toBase64Image(file);
          return {
            file: base64,
            typeStorage: file.type.startsWith("video/") ? "video" : "image",
          };
        })
      );

      await axios.put(`${API_BASE_URL}/farms/addStorage`, {
        NID: farmerNID,
        FID: farm.FID,
        storages,
      });

      // Refresh ข้อมูลฟาร์ม
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      alert("เพิ่มรูป/วิดีโอสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเพิ่มรูป/วิดีโอ");
    } finally {
      e.target.value = "";
    }
  };

  // ลบรูป/วิดีโอ
  const handleDeleteStorage = async (storageID) => {
    if (!isOwner) {
      alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }
    if (!window.confirm("คุณต้องการลบรูป/วิดีโอนี้หรือไม่?") || !farm?.FID || !farmerNID) return;

    try {
      await axios.put(`${API_BASE_URL}/farms/deleteStorage`, {
        NID: farmerNID,
        FID: farm.FID,
        storagesID: storageID,
      });

      // Refresh ข้อมูลฟาร์ม
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      alert("ลบรูป/วิดีโอสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบรูป/วิดีโอ");
    }
  };

  // เพิ่ม Certificate
  const handleAddCertificate = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !farm?.FID || !farmerNID || !isOwner) {
      if (!isOwner) alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }

    try {
      for (const file of files) {
        const base64 = await toBase64Image(file);
        await axios.post(`${API_BASE_URL}/farms/certificate`, {
          NID: farmerNID,
          FID: farm.FID,
          certificate: {
            institution: file.name || "ใบรับรอง",
            file: base64,
          },
        });
      }

      // Refresh ข้อมูลฟาร์ม
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      alert("เพิ่มใบรับรองสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเพิ่มใบรับรอง");
    } finally {
      e.target.value = "";
    }
  };

  // ลบ Certificate
  const handleDeleteCertificate = async (certificateID) => {
    if (!isOwner) {
      alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลฟาร์มนี้");
      return;
    }
    if (!window.confirm("คุณต้องการลบใบรับรองนี้หรือไม่?") || !farm?.FID || !farmerNID) return;

    try {
      await axios.delete(`${API_BASE_URL}/farms/certificate`, {
        data: {
          NID: farmerNID,
          FID: farm.FID,
          certificateID: certificateID,
        },
      });

      // Refresh ข้อมูลฟาร์ม
      const res = await axios.get(`${API_BASE_URL}/farms/${farm.FID}`);
      setFarm(res.data);
      alert("ลบใบรับรองสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบใบรับรอง");
    }
  };

  return (
    <div className={className}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="farm-badge">🌾 ฟาร์มออนไลน์</div>
          <h1 className="farm-title">{farm.farmName}</h1>
          <div className="location-tag">
            📍{" "}
            {farm.Location
              ? `${farm.Location.subDistrict || ""} ${farm.Location.district || ""} ${
                  farm.Location.province || ""
                }`
              : `${farm.subDistrict || ""} ${farm.district || ""} ${farm.province || ""}`}
          </div>
        </div>
      </div>

      <div className="container">

        <div className="content-grid">
          {/* Left Column */}
          <div className="main-content">
            {/* Story Section */}
            <div className="story-card">
              {/* Farm Profile Image */}
              <div style={{ marginBottom: "25px", textAlign: "center" }}>
                <div className="farmer-avatar" style={{ position: "relative", margin: "0 auto", display: "inline-block" }}>
                  <img 
                    src={farm.profileImage || defaultFarmerImage} 
                    alt="Farm Profile"
                    onError={(e) => { e.target.src = defaultFarmerImage; }}
                  />
                  {isOwner && (
                    <label
                      style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        background: "#667eea",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: "18px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                </div>
                {isOwner && (
                  <div style={{ marginTop: "10px" }}>
                    <label
                      style={{
                        padding: "8px 16px",
                        background: farm.profileImage ? "#667eea" : "#22c55e",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        display: "inline-block",
                      }}
                    >
                      {farm.profileImage ? "✏️ แก้ไขโปรไฟล์ฟาร์ม" : "➕ เพิ่มโปรไฟล์ฟาร์ม"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
                {!isOwner && farm.profileImage && (
                  <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
                    รูปโปรไฟล์ฟาร์ม
                  </p>
                )}
              </div>

              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>📖 เรื่องราวของเรา</h2>
                {isOwner && (
                  <button
                    type="button"
                    onClick={isEditingDescription ? handleToggleEditDescription : handleToggleEditDescription}
                    style={{
                      padding: "8px 16px",
                      background: isEditingDescription ? "#ef4444" : "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {isEditingDescription ? "✕ ยกเลิก" : "✏️ แก้ไข"}
                  </button>
                )}
              </div>
              {isEditingDescription ? (
                <div style={{ marginTop: "15px" }}>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="บอกเล่าเกี่ยวกับฟาร์มของคุณ..."
                    rows="6"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontFamily: "inherit",
                      marginBottom: "10px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={handleUpdateDescription}
                      disabled={isSaving}
                      style={{
                        padding: "10px 20px",
                        background: isSaving ? "#ccc" : "#22c55e",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: isSaving ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {isSaving ? "กำลังบันทึก..." : "💾 บันทึก"}
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleEditDescription}
                      style={{
                        padding: "10px 20px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <p className="story-text">
                  {farm.description || "ยังไม่มีรายละเอียดเกี่ยวกับฟาร์ม"}
                </p>
              )}
            </div>

                  {/* Image Gallery */}
              <div className="gallery-section">
                {isOwner && (
                  <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ margin: 0, fontSize: "24px" }}>📸 รูปภาพฟาร์ม</h2>
                    <label
                      style={{
                        padding: "10px 20px",
                        background: "#22c55e",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      ➕ เพิ่มรูป/วิดีโอ
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleAddStorage}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
                {!isOwner && (
                  <h2 style={{ marginBottom: "15px", fontSize: "24px" }}>📸 รูปภาพฟาร์ม</h2>
                )}
                {images.length > 0 ? (
                  <>
                    <div className="main-image" style={{ position: "relative" }}>
                      <img src={images[activeImage]?.file} alt="Farm" />
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStorage(images[activeImage]?.id)}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(239, 68, 68, 0.9)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            cursor: "pointer",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className="thumbnail-list">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={`thumbnail ${activeImage === idx ? "active" : ""}`}
                            onClick={() => setActiveImage(idx)}
                            style={{ position: "relative" }}
                          >
                            <img src={img.file} alt={`Thumbnail ${idx + 1}`} />
                            {isOwner && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStorage(img.id);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "5px",
                                  right: "5px",
                                  background: "rgba(239, 68, 68, 0.9)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "24px",
                                  height: "24px",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                    {isOwner ? "ยังไม่มีรูปภาพ กดปุ่มเพิ่มรูป/วิดีโอเพื่ออัปโหลด" : "ยังไม่มีรูปภาพ"}
                  </div>
                )}
              </div>

            {/* Certificates */}
            <div className="certificate-card">
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>🏆 ใบรับรองมาตรฐาน</h2>
                {isOwner && (
                  <label
                    style={{
                      padding: "8px 16px",
                      background: "#22c55e",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    ➕ เพิ่มใบรับรอง
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleAddCertificate}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
              {farm.Certificates && farm.Certificates.length > 0 ? (
                <div className="cert-grid">
                  {farm.Certificates.map((cert, idx) => (
                    <div key={idx} className="cert-item">
                      <div className="cert-icon">📜</div>
                      <div className="cert-info">
                        <h4>{cert.institution}</h4>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            className="view-cert-btn"
                            type="button"
                            onClick={() => handleViewCertificate(cert)}
                          >
                            ดูใบรับรอง
                          </button>
                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCertificate(cert.id)}
                              style={{
                                padding: "8px 20px",
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "14px",
                              }}
                            >
                              ลบ
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                  {isOwner ? "ยังไม่มีใบรับรอง กดปุ่มเพิ่มใบรับรองเพื่ออัปโหลด" : "ยังไม่มีใบรับรอง"}
                </div>
              )}
            </div>

            {/* Videos */}
            <div className="video-card">
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>🎥 วิดีโอแนะนำฟาร์ม</h2>
                {isOwner && (
                  <label
                    style={{
                      padding: "8px 16px",
                      background: "#22c55e",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    ➕ เพิ่มวิดีโอ
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleAddStorage}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
              {videos.length > 0 ? (
                <div className="video-grid">
                  {videos.map((video, idx) => (
                    <div key={idx} className="video-item" style={{ position: "relative" }}>
                      <video controls>
                        <source src={video.file} />
                        เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                      </video>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStorage(video.id)}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(239, 68, 68, 0.9)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            cursor: "pointer",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                  {isOwner ? "ยังไม่มีวิดีโอ กดปุ่มเพิ่มรูป/วิดีโอเพื่ออัปโหลด" : "ยังไม่มีวิดีโอ"}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sidebar">
            {/* Farmer Card */}
            <div className="farmer-card">
              {/* Farmer Profile Image */}
              <div className="farmer-avatar" style={{ position: "relative", margin: "0 auto 20px" }}>
                <img 
                  src={farm.User?.profileImage || farm.User?.ProfileImage || defaultFarmerImage} 
                  alt="Farmer"
                  onError={(e) => { e.target.src = defaultFarmerImage; }}
                />
                {isOwner && (
                  <label
                    style={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      background: "#667eea",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "18px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUserProfileImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
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
              {isOwner && (
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <label
                    style={{
                      padding: "8px 16px",
                      background: (farm.User?.profileImage || farm.User?.ProfileImage) ? "#667eea" : "#22c55e",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    {(farm.User?.profileImage || farm.User?.ProfileImage) ? "✏️ แก้ไขโปรไฟล์เกษตรกร" : "➕ เพิ่มโปรไฟล์เกษตรกร"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUserProfileImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="contact-card">
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>📞 ติดต่อเรา</h3>
                {isOwner && (
                  <button
                    type="button"
                    onClick={handleToggleEditContact}
                    style={{
                      padding: "8px 16px",
                      background: isEditingContact ? "#ef4444" : "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {isEditingContact ? "✕ ยกเลิก" : "✏️ แก้ไข"}
                  </button>
                )}
              </div>
              
              {isEditingContact ? (
                <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="text"
                    placeholder="ชื่อฟาร์ม"
                    value={editContact.farmName || ""}
                    onChange={(e) => setEditContact({ ...editContact, farmName: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="อีเมล"
                    value={editContact.email || ""}
                    onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="เบอร์โทรศัพท์"
                    value={editContact.phoneNumber || ""}
                    onChange={(e) => setEditContact({ ...editContact, phoneNumber: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="ที่อยู่"
                    value={editContact.location || ""}
                    onChange={(e) => setEditContact({ ...editContact, location: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="จังหวัด"
                    value={editContact.province || ""}
                    onChange={(e) => setEditContact({ ...editContact, province: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="อำเภอ/เขต"
                    value={editContact.district || ""}
                    onChange={(e) => setEditContact({ ...editContact, district: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="ตำบล/แขวง"
                    value={editContact.subDistrict || ""}
                    onChange={(e) => setEditContact({ ...editContact, subDistrict: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="LINE ID"
                    value={editContact.line || ""}
                    onChange={(e) => setEditContact({ ...editContact, line: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Facebook"
                    value={editContact.facebook || ""}
                    onChange={(e) => setEditContact({ ...editContact, facebook: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                    <button
                      type="button"
                      onClick={handleUpdateContact}
                      disabled={isSaving}
                      style={{
                        padding: "10px 20px",
                        background: isSaving ? "#ccc" : "#22c55e",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: isSaving ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        flex: 1,
                      }}
                    >
                      {isSaving ? "กำลังบันทึก..." : "💾 บันทึก"}
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleEditContact}
                      style={{
                        padding: "10px 20px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        flex: 1,
                      }}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Action Button */}
            <button
              type="button"
              className="products-btn"
              onClick={openProductsModal}
            >
              🛒 ดูสินค้าของฟาร์ม
            </button>
          </div>
        </div>
      </div>
      {isCertificateModalOpen && selectedCertificate && (
        <div className="cert-modal-overlay" onClick={closeCertificateModal}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-modal-btn"
              onClick={closeCertificateModal}
            >
              ×
            </button>
            <h3>{selectedCertificate.institution || "ใบรับรองมาตรฐาน"}</h3>
            <div className="cert-preview">
              {getCertificateType(selectedCertificate.file) === "pdf" ? (
                <iframe
                  title="certificate-preview"
                  src={selectedCertificate.file}
                />
              ) : (
                <img
                  src={selectedCertificate.file}
                  alt="certificate-preview"
                />
              )}
            </div>
            <div className="cert-modal-actions">
              <a
                className="open-cert-link"
                href={selectedCertificate.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                เปิดในแท็บใหม่
              </a>
            </div>
          </div>
        </div>
      )}
      {isProductsModalOpen && (
        <div className="products-modal-overlay" onClick={closeProductsModal}>
          <div className="products-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-modal-btn"
              onClick={closeProductsModal}
            >
              ×
            </button>
            <h3>สินค้าในฟาร์ม</h3>
            {productsModalLoading ? (
              <div className="modal-loading">กำลังโหลดสินค้า...</div>
            ) : productsModalError ? (
              <div className="modal-error">{productsModalError}</div>
            ) : farmProducts.length === 0 ? (
              <div className="modal-empty">ยังไม่มีสินค้า</div>
            ) : (
              <div className="products-grid">
                {farmProducts.map((product) => (
                  <div key={product.PID} className="product-card">
                    <div className="product-thumb">
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/200x150?text=No+Image"
                        }
                        alt={product.productName || "สินค้า"}
                      />
                    </div>
                    <div className="product-info">
                      <h4>{product.productName || "สินค้า"}</h4>
                      <p className="price">
                        {product.price != null ? `${product.price} บาท` : "-"}
                      </p>
                      <Link
                        to={`/product/${product.PID}`}
                        className="product-link"
                        onClick={closeProductsModal}
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
    border: none;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(67, 233, 123, 0.4);
    }
  }

  .cert-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .cert-modal {
    background: white;
    border-radius: 20px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    padding: 30px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  .close-modal-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    font-size: 30px;
    cursor: pointer;
    line-height: 1;
    color: #999;

    &:hover {
      color: #333;
    }
  }

  .cert-preview {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background: #f6f7fb;
    padding: 20px;

    img,
    iframe {
      width: 100%;
      height: 70vh;
      max-height: 600px;
      border: none;
      border-radius: 12px;
      object-fit: contain;
      background: white;
    }
  }

  .cert-modal-actions {
    display: flex;
    justify-content: flex-end;
  }

  .open-cert-link {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    transition: background 0.3s;

    &:hover {
      background: #5568d3;
    }
  }

  .products-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 20px;
    z-index: 1200;
    overflow-y: auto;
  }

  .products-modal {
    background: white;
    border-radius: 24px;
    width: min(1100px, 100%);
    padding: 30px;
    position: relative;
    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .products-modal h3 {
    margin: 0;
    font-size: 26px;
    color: #1f2937;
  }

  .modal-loading,
  .modal-error,
  .modal-empty {
    padding: 30px;
    text-align: center;
    color: #6b7280;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  .product-card {
    background: #f9fafb;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: inset 0 0 0 1px #e5e7eb;
  }

  .product-thumb {
    width: 100%;
    height: 160px;
    background: #eef2ff;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .product-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    h4 {
      margin: 0;
      color: #111827;
      font-size: 16px;
    }

    .price {
      margin: 0;
      color: #22c55e;
      font-weight: 700;
    }
  }

  .product-link {
    margin-top: 8px;
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;
    align-self: flex-start;

    &:hover {
      text-decoration: underline;
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