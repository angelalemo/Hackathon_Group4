import React, { useState } from 'react';
import { Menu, Bell, ChevronLeft, Plus, Upload } from 'lucide-react';

export default function Storage() {
  const [page, setPage] = useState('list'); // list, add, edit
  const [products, setProducts] = useState([
    { id: 1, name: 'ตะไคร้ 1 กก.', price: 120, image: null },
    { id: 2, name: 'แตงกวา 1 กก.', price: 120, image: null }
  ]);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'ผักสวน',
    price: '',
    image: null
  });

  const handleAddProduct = () => {
    setPage('add');
    setFormData({ name: '', category: 'ผักสวน', price: '', image: null });
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      category: 'ผักสวน',
      price: product.price,
      image: product.image
    });
    setPage('edit');
  };

  const handleSaveAdd = () => {
    if (formData.name && formData.price) {
      const newProduct = {
        id: products.length + 1,
        name: formData.name,
        price: parseInt(formData.price),
        image: formData.image
      };
      setProducts([...products, newProduct]);
      setPage('list');
    }
  };

  const handleSaveEdit = () => {
    if (formData.name && formData.price) {
      setProducts(products.map(p => 
        p.id === editProduct.id 
          ? { ...p, name: formData.name, price: parseInt(formData.price), image: formData.image }
          : p
      ));
      setPage('list');
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleCancelAdd = () => {
    setPage('list');
  };

  const handleCancelEdit = () => {
    setProducts(products.filter(p => p.id !== editProduct.id));
    setPage('list');
  };

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

  // หน้าคลังสินค้า
  if (page === 'list') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="w-6 h-6" />
            <span className="text-2xl font-bold text-green-600">Phaktae</span>
          </div>
          <div className="flex gap-3">
            <Bell className="w-6 h-6" />
            <div className="w-6 h-6 border-2 border-gray-800" />
          </div>
        </div>

        {/* Title Bar */}
        <div className="bg-green-700 text-white p-4 flex items-center gap-3">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xl font-semibold">คลังสินค้า</span>
        </div>

        {/* Product Grid */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 aspect-square flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-gray-300" />
                )}
              </div>
              <div className="p-3">
                <div className="font-medium text-sm mb-2">{product.name}</div>
                <div className="text-sm text-gray-600 mb-3">฿{product.price}/กก.</div>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="w-full bg-blue-600 text-white py-1.5 rounded text-sm"
                  >
                    แก้ไขสินค้า
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-full bg-red-600 text-white py-1.5 rounded text-sm"
                  >
                    ลบสินค้า
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Product Button */}
          <button 
            onClick={handleAddProduct}
            className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <Plus className="w-12 h-12 mb-2" />
            <span className="text-sm">เพิ่มสินค้า</span>
          </button>
        </div>
      </div>
    );
  }

  // หน้าเพิ่มสินค้า
  if (page === 'add') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="w-6 h-6" />
            <span className="text-2xl font-bold text-green-600">Phaktae</span>
          </div>
          <div className="flex gap-3">
            <Bell className="w-6 h-6" />
            <div className="w-6 h-6 border-2 border-gray-800" />
          </div>
        </div>

        {/* Title Bar */}
        <div className="bg-green-700 text-white p-4 flex items-center gap-3">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setPage('list')} />
          <span className="text-xl font-semibold">เพิ่มสินค้า</span>
        </div>

        {/* Form */}
        <div className="p-4">
          <div className="mb-4">
            <label className="block mb-2">ชื่อสินค้า :</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-green-500 rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">รูปแบบการขาย :</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="ผักสวน">ผักสวน</option>
              <option value="ผักไร่">ผักไร่</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">ราคา :</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="flex-1 border border-green-500 rounded px-3 py-2"
              />
              <span>บาท</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">รูปภาพ :</label>
            <label className="block bg-gray-200 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="max-h-40 mx-auto" />
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                  <div className="text-gray-600">เพิ่มรูปภาพสินค้า</div>
                </div>
              )}
            </label>
          </div>

          <button
            onClick={handleSaveAdd}
            className="w-full bg-green-700 text-white py-3 rounded-lg text-lg font-semibold mb-3 hover:bg-green-800"
          >
            เพิ่มสินค้า
          </button>

          <button
            onClick={handleCancelAdd}
            className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700"
          >
            ยกเลิกเพิ่มสินค้า
          </button>
        </div>
      </div>
    );
  }

  // หน้าแก้ไขสินค้า
  if (page === 'edit') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="w-6 h-6" />
            <span className="text-2xl font-bold text-green-600">Phaktae</span>
          </div>
          <div className="flex gap-3">
            <Bell className="w-6 h-6" />
            <div className="w-6 h-6 border-2 border-gray-800" />
          </div>
        </div>

        {/* Title Bar */}
        <div className="bg-green-700 text-white p-4 flex items-center gap-3">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setPage('list')} />
          <span className="text-xl font-semibold">แก้ไขสินค้า</span>
        </div>

        {/* Form */}
        <div className="p-4">
          <div className="mb-4">
            <label className="block mb-2">ชื่อสินค้า :</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-green-500 rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">รูปแบบการขาย :</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="ผักสวน">ผักสวน</option>
              <option value="ผักไร่">ผักไร่</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">ราคา :</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="flex-1 border border-green-500 rounded px-3 py-2"
              />
              <span>บาท</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">รูปภาพ :</label>
            <label className="block bg-gray-200 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="max-h-40 mx-auto" />
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                  <div className="text-gray-600">แก้ไขรูปภาพสินค้า</div>
                </div>
              )}
            </label>
          </div>

          <button
            onClick={handleSaveEdit}
            className="w-full bg-green-700 text-white py-3 rounded-lg text-lg font-semibold mb-3 hover:bg-green-800"
          >
            แก้ไขสินค้า
          </button>

          <button
            onClick={handleCancelEdit}
            className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700"
          >
            ยกเลิกแก้ไข
          </button>
        </div>
      </div>
    );
  }
}