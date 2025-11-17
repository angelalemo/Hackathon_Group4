// frontend/ProductManagement/ProductListPage.js
import React from 'react';
import styled from 'styled-components';
import { Menu, Bell, ChevronLeft, Plus } from 'lucide-react';

const ProductListPage = ({ className, products, onAddProduct, onEditProduct, onDeleteProduct }) => {
  return (
    <div className={className}>


      <div className="title-bar">
        <ChevronLeft size={24} />
        <span className="title">คลังสินค้า</span>
      </div>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.PID} className="product-card">
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.productName} />
              ) : (
                <div className="image-placeholder" />
              )}
            </div>
            <div className="product-info">
              <div className="product-name">{product.productName}</div>
              <div className="product-category">{product.category}</div>
              <div className="product-price">฿{product.price}/{product.saleType}</div>
              <div className="button-container">
                <button 
                  className="edit-button"
                  onClick={() => onEditProduct(product)}
                >
                  แก้ไขสินค้า
                </button>
                <button 
                  className="delete-button"
                  onClick={() => onDeleteProduct(product.PID)}
                >
                  ลบสินค้า
                </button>
              </div>
            </div>
          </div>
        ))}

        <button className="add-product-button" onClick={onAddProduct}>
          <Plus size={48} />
          <span>เพิ่มสินค้า</span>
        </button>
      </div>
    </div>
  );
};

export default styled(ProductListPage)`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: white;
  min-height: 100vh;

  @media (min-width: 769px) {
    max-width: 1200px;
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
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .product-grid {
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .product-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .product-image {
    background-color: #f3f4f6;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .image-placeholder {
    width: 5rem;
    height: 5rem;
    background-color: #d1d5db;
  }

  .product-info {
    padding: 0.75rem;
  }

  .product-name {
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .product-category {
    font-size: 0.75rem;
    color: #16a34a;
    margin-bottom: 0.25rem;
  }

  .product-price {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 0.75rem;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .edit-button {
    width: 100%;
    background-color: #2563eb;
    color: white;
    padding: 0.375rem 0;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #1d4ed8;
    }
  }

  .delete-button {
    width: 100%;
    background-color: #dc2626;
    color: white;
    padding: 0.375rem 0;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #b91c1c;
    }
  }

  .add-product-button {
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    background: transparent;
    cursor: pointer;

    &:hover {
      background-color: #f9fafb;
    }

    span {
      font-size: 0.875rem;
    }
  }
`;