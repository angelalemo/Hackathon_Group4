// frontend/ProductManagement.js
import React, { useState } from 'react';
import ProductListPage from './ProductManagement/ProductListPage';
import AddProductPage from './ProductManagement/AddProductPage';
import EditProductPage from './ProductManagement/EditProductPage';

export default function ProductManagement() {
  const [page, setPage] = useState('list');
  const [products, setProducts] = useState([
    { id: 1, name: 'ตะไคร้ 1 กก.', price: 120, image: null },
    { id: 2, name: 'แตงกวา 1 กก.', price: 120, image: null }
  ]);
  const [editProduct, setEditProduct] = useState(null);

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: products.length + 1,
      ...productData
    };
    setProducts([...products, newProduct]);
    setPage('list');
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setPage('edit');
  };

  const handleSaveEdit = (productData) => {
    setProducts(products.map(p => 
      p.id === editProduct.id ? { ...p, ...productData } : p
    ));
    setPage('list');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleCancelEdit = () => {
    setProducts(products.filter(p => p.id !== editProduct.id));
    setPage('list');
  };

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