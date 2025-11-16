// frontend/ProductManagement/EditProductPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, Bell, ChevronLeft, Upload } from 'lucide-react';

const EditProductPage = ({ className, product, onSave, onCancel, onBack }) => {
  const [formData, setFormData] = useState({
    productName: product.productName || '',
    category: product.category || 'ผักสวน',
    saleType: product.saleType || 'กก.',
    price: product.price || '',
    image: product.image || null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (formData.productName && formData.price) {
      onSave({
        productName: formData.productName,
        category: formData.category,
        saleType: formData.saleType,
        price: parseFloat(formData.price),
        image: formData.image
      });
    } else {
      alert('กรุณากรอกชื่อสินค้าและราคา');
    }
  };

  return (
    <div className={className}>
      <div className="header">
        <div className="logo-container">
          <Menu size={24} />
          <span className="logo">Phaktae</span>
        </div>
        <div className="header-icons">
          <Bell size={24} />
          <div className="profile-box" />
        </div>
      </div>

      <div className="title-bar" onClick={onBack}>
        <ChevronLeft size={24} />
        <span className="title">แก้ไขสินค้า</span>
      </div>

      <div className="form">
        <div className="form-group">
          <label className="label">ชื่อสินค้า :</label>
          <input
            type="text"
            className="input"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="label">รูปแบบการขาย :</label>
          <select
            className="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="ผักสวน">ผักสวน</option>
            <option value="ผักไร่">ผักไร่</option>
            <option value="ผลไม้">ผลไม้</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">หน่วยขาย :</label>
          <select
            className="select"
            value={formData.saleType}
            onChange={(e) => setFormData({ ...formData, saleType: e.target.value })}
          >
            <option value="กก.">กก.</option>
            <option value="ลัง">ลัง</option>
            <option value="กระสอบ">กระสอบ</option>
            <option value="ลูก">ลูก</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">ราคา :</label>
          <div className="price-group">
            <input
              type="number"
              className="input price-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <span>บาท/{formData.saleType}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="label">รูปภาพ :</label>
          <label className="image-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <Upload size={48} />
                <div className="upload-text">แก้ไขรูปภาพสินค้า</div>
              </div>
            )}
          </label>
        </div>

        <button className="save-button" onClick={handleSave}>
          แก้ไขสินค้า
        </button>

        <button className="cancel-button" onClick={onCancel}>
          ยกเลิกแก้ไข
        </button>
      </div>
    </div>
  );
};

export default styled(EditProductPage)`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: white;
  min-height: 100vh;

  @media (min-width: 769px) {
    max-width: 800px;
  }

  .header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #16a34a;
  }

  .header-icons {
    display: flex;
    gap: 0.75rem;
  }

  .profile-box {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid #1f2937;
  }

  .title-bar {
    background-color: #15803d;
    color: white;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .form {
    padding: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .input {
    width: 100%;
    border: 1px solid #16a34a;
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #15803d;
    }
  }

  .select {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #9ca3af;
    }
  }

  .price-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .price-input {
    flex: 1;
  }

  .image-upload-label {
    display: block;
    background-color: #e5e7eb;
    border-radius: 0.5rem;
    padding: 3rem;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: #d1d5db;
    }
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #4b5563;
  }

  .upload-text {
    color: #4b5563;
    margin-top: 0.5rem;
  }

  .preview-image {
    max-height: 10rem;
    margin: 0 auto;
  }

  .save-button {
    width: 100%;
    background-color: #15803d;
    color: white;
    padding: 0.75rem 0;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #166534;
    }
  }

  .cancel-button {
    width: 100%;
    background-color: #dc2626;
    color: white;
    padding: 0.75rem 0;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #b91c1c;
    }
  }
`;