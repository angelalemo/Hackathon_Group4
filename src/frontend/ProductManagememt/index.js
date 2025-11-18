import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ChevronLeft, Plus, Upload, X } from 'lucide-react';

// Main Component
export default function ProductManagement() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const userId = currentUser?.NID;
  const farmId = currentUser?.FID || currentUser?.Farm?.FID;

  useEffect(() => {
    if (userId) {
      loadProducts();
    }
  }, [userId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const url = farmId 
        ? `http://localhost:4000/products/Farm/${farmId}`
        : "http://localhost:4000/products/All";
      const res = await axios.get(url);
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
      if (!userId) {
        alert('ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่');
        return;
      }

      const requestData = {
        NID: userId,
        FID: farmId || productData.FID,
        productName: productData.productName,
        category: productData.category,
        saleType: productData.saleType,
        price: productData.price,
        image: productData.image
      };

      await axios.post("http://localhost:4000/products/create", requestData);
      await loadProducts();
      setShowModal(false);
      alert("เพิ่มสินค้าสำเร็จ!");
    } catch (err) {
      console.error("Error adding product:", err);
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || "ไม่สามารถเพิ่มสินค้าได้";
      alert("เกิดข้อผิดพลาด: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSaveEdit = async (productData) => {
    try {
      setLoading(true);
      const requestData = {
        NID: userId,
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
      setShowModal(false);
      alert("แก้ไขสินค้าสำเร็จ!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.error || "ไม่สามารถแก้ไขสินค้าได้"));
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
      await axios.delete(`http://localhost:4000/products/delete`, {
        data: { 
          NID: userId,
          PID: pid 
        }
      });
      await loadProducts();
      alert("ลบสินค้าสำเร็จ!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.error || "ไม่สามารถลบสินค้าได้"));
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditProduct(null);
    setModalMode('add');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  if (loading && products.length === 0) {
    return <LoadingContainer>กำลังโหลด...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  return (
    <Container>
      <TitleBar>
        <ChevronLeft size={24} />
        <Title>คลังสินค้า</Title>
      </TitleBar>

      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.PID}>
            <ProductImage>
              {product.image ? (
                <img src={product.image} alt={product.productName} />
              ) : (
                <ImagePlaceholder />
              )}
            </ProductImage>
            <ProductInfo>
              <ProductName>{product.productName}</ProductName>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductPrice>฿{product.price}/{product.saleType}</ProductPrice>
              <ButtonContainer>
                <EditButton onClick={() => handleEditProduct(product)}>
                  แก้ไขสินค้า
                </EditButton>
                <DeleteButton onClick={() => handleDeleteProduct(product.PID)}>
                  ลบสินค้า
                </DeleteButton>
              </ButtonContainer>
            </ProductInfo>
          </ProductCard>
        ))}

        <AddProductButton onClick={openAddModal}>
          <Plus size={48} />
          <span>เพิ่มสินค้า</span>
        </AddProductButton>
      </ProductGrid>

      {showModal && (
        <ProductModal
          mode={modalMode}
          product={editProduct}
          onSave={modalMode === 'add' ? handleAddProduct : handleSaveEdit}
          onClose={closeModal}
        />
      )}
    </Container>
  );
}

// Modal Component
function ProductModal({ mode, product, onSave, onClose }) {
  const [formData, setFormData] = useState({
    productName: product?.productName || '',
    category: product?.category || '',
    saleType: product?.saleType || '',
    price: product?.price || '',
    image: product?.image || null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800; // ปรับขนาดสูงสุด
        const maxHeight = 800;

        let width = img.width;
        let height = img.height;

        // ย่อขนาดตามสัดส่วน
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // ลดคุณภาพภาพ (0.7 = 70%)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

        setFormData({ ...formData, image: compressedDataUrl });
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
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
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{mode === 'add' ? 'เพิ่มสินค้า' : 'แก้ไขสินค้า'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>ชื่อสินค้า :</Label>
            <Input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>ประเภทผัก :</Label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">-- เลือกประเภทผัก --</option>
              <option value="ผักกินใบ">ผักกินใบ</option>
              <option value="ผักกินผล">ผักกินผล</option>
              <option value="ผักรากหัว">ผักรากหัว</option>
              <option value="สมุนไพร/เครื่องเทศ">สมุนไพร/เครื่องเทศ</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>รูปแบบการขาย :</Label>
            <Select
              value={formData.saleType}
              onChange={(e) => setFormData({ ...formData, saleType: e.target.value })}
            >
              <option value="">-- เลือกรูปแบบการขาย --</option>
              <option value="กก.">กก.</option>
              <option value="ลัง">ลัง</option>
              <option value="กระสอบ">กระสอบ</option>
              <option value="ถุง">ถุง</option>
              <option value="กล่อง">กล่อง</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>ราคา :</Label>
            <PriceGroup>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ flex: 1 }}
              />
              <span>บาท/{formData.saleType}</span>
            </PriceGroup>
          </FormGroup>

          <FormGroup>
            <Label>รูปภาพ :</Label>
            <ImageUploadLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {formData.image ? (
                <PreviewImage src={formData.image} alt="Preview" />
              ) : (
                <UploadPlaceholder>
                  <Upload size={40} />
                  <UploadText>{mode === 'add' ? 'เพิ่มรูปภาพสินค้า' : 'แก้ไขรูปภาพสินค้า'}</UploadText>
                </UploadPlaceholder>
              )}
            </ImageUploadLabel>
          </FormGroup>

          <SaveButton onClick={handleSave}>
            {mode === 'add' ? 'เพิ่มสินค้า' : 'แก้ไขสินค้า'}
          </SaveButton>

          <CancelButton onClick={onClose}>
            {mode === 'add' ? 'ยกเลิกเพิ่มสินค้า' : 'ยกเลิกแก้ไข'}
          </CancelButton>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: white;
  min-height: 100vh;

  @media (min-width: 769px) {
    max-width: 1200px;
  }
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #dc2626;
`;

const TitleBar = styled.div`
  background-color: #15803d;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`;

const ProductGrid = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ProductImage = styled.div`
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
`;

const ImagePlaceholder = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: #d1d5db;
`;

const ProductInfo = styled.div`
  padding: 0.75rem;
`;

const ProductName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const ProductCategory = styled.div`
  font-size: 0.75rem;
  color: #16a34a;
  margin-bottom: 0.25rem;
`;

const ProductPrice = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EditButton = styled.button`
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
`;

const DeleteButton = styled.button`
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
`;

const AddProductButton = styled.button`
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
    margin-top: 0.5rem;
  }
`;

// Modal Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  background-color: #15803d;
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #16a34a;
  border-radius: 0.375rem;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #15803d;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #9ca3af;
    box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
  }
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span {
    white-space: nowrap;
    color: #6b7280;
  }
`;

const ImageUploadLabel = styled.label`
  display: block;
  background-color: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }
`;

const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
`;

const UploadText = styled.div`
  color: #6b7280;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const PreviewImage = styled.img`
  max-height: 12rem;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 0.375rem;
`;

const SaveButton = styled.button`
  width: 100%;
  background-color: #15803d;
  color: white;
  padding: 0.75rem 0;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #166534;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled.button`
  width: 100%;
  background-color: #dc2626;
  color: white;
  padding: 0.75rem 0;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }

  &:active {
    transform: scale(0.98);
  }
`;