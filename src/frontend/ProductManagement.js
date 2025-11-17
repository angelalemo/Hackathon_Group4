// frontend/ProductManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductListPage from './ProductManagement/ProductListPage';
import AddProductPage from './ProductManagement/AddProductPage';
import EditProductPage from './ProductManagement/EditProductPage';

export default function ProductManagement() {
  const [page, setPage] = useState('list');
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ดึงข้อมูล User จาก localStorage ที่เก็บไว้ตอน login
  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const userData = localStorage.getItem('user');
  if (!userData) {
    alert('กรุณา Login ก่อนใช้งาน');
    window.location.href = '/login';
  } else {
    setCurrentUser(JSON.parse(userData));
  }
}, []);

  
  const userId = currentUser?.NID; // NID ของผู้ใช้ที่ login
  const farmId = currentUser?.FID || currentUser?.Farm?.FID; // FID ของฟาร์ม (ถ้ามี)

  // โหลดข้อมูลจาก backend
  useEffect(() => {
    if (userId) {
      loadProducts();
    }
  }, [userId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // ถ้ามี FID ให้โหลดเฉพาะของฟาร์มนั้น ถ้าไม่มีให้โหลดทั้งหมด
      const url = farmId 
        ? `http://localhost:4000/products/${farmId}`
        : "http://localhost:4000/products/All";
        
      const res = await axios.get(url);
      console.log("Products loaded:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      setLoading(true);
      
      // ตรวจสอบว่ามี userId หรือไม่
      if (!userId) {
        alert('ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่');
        return;
      }
      
      // เตรียมข้อมูลให้ตรงกับหลังบ้าน - ต้องมี NID ด้วย
      const requestData = {
        NID: userId, // ส่ง NID ของผู้ใช้ที่กำลัง login
        FID: farmId || productData.FID, // ใช้ FID จาก user หรือจากฟอร์ม
        productName: productData.productName,
        category: productData.category,
        saleType: productData.saleType,
        price: productData.price,
        image: productData.image
      };
      
      console.log("=== DEBUG: Sending product data ===");
      console.log("Request data:", requestData);
      console.log("API URL:", "http://localhost:4000/products/create");
      
      const res = await axios.post("http://localhost:4000/products/create", requestData);
      console.log("✅ Product created:", res.data);
      
      await loadProducts();
      setPage('list');
      alert("เพิ่มสินค้าสำเร็จ!");
    } catch (err) {
      console.error("❌ Error adding product:");
      console.error("Full error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || "ไม่สามารถเพิ่มสินค้าได้";
        
      alert("เกิดข้อผิดพลาด: " + errorMsg + "\n\nกรุณาเช็ค Console (F12) เพื่อดูรายละเอียด");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    console.log("Editing product:", product);
    setEditProduct(product);
    setPage('edit');
  };

  const handleSaveEdit = async (productData) => {
    try {
      setLoading(true);
      console.log("Updating product:", editProduct.PID, productData);
      
      // เตรียมข้อมูลให้ตรงกับหลังบ้าน - ต้องมี NID และ PID
      const requestData = {
        NID: userId, // ส่ง NID ของผู้ใช้ที่กำลัง login
        PID: editProduct.PID,
        FID: editProduct.FID,
        productName: productData.productName,
        category: productData.category,
        saleType: productData.saleType,
        price: productData.price,
        image: productData.image
      };
      
      await axios.put(`http://localhost:4000/products/update`, requestData);
      
      await loadProducts();
      setPage('list');
      alert("แก้ไขสินค้าสำเร็จ!");
    } catch (err) {
      console.error("Error updating product:", err.response?.data || err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.error || err.response?.data?.message || "ไม่สามารถแก้ไขสินค้าได้"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (pid) => {
    if (!window.confirm("คุณต้องการลบสินค้านี้หรือไม่?")) {
      return;
    }

    try {
      setLoading(true);
      console.log("Deleting product:", pid);
      
      await axios.delete(`http://localhost:4000/products/delete`, {
        data: { 
          NID: userId, // ส่ง NID ของผู้ใช้ที่กำลัง login
          PID: pid 
        }
      });
      
      await loadProducts();
      alert("ลบสินค้าสำเร็จ!");
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.error || err.response?.data?.message || "ไม่สามารถลบสินค้าได้"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setPage('list');
  };

  if (loading && products.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลด...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (page === 'list') {
    return (
      <ProductListPage
        products={products}
        onAddProduct={() => setPage('add')}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    );
  }

  if (page === 'add') {
    return (
      <AddProductPage
        onSave={handleAddProduct}
        onCancel={() => setPage('list')}
      />
    );
  }

  if (page === 'edit') {
    return (
      <EditProductPage
        product={editProduct}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onBack={() => setPage('list')}
      />
    );
  }
}