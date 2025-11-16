import React, { useState } from 'react';
import { Upload, Menu, Bell, Laptop, ChevronLeft } from 'lucide-react';

export default function PhaktaeWebsite() {
  const [formData, setFormData] = useState({
    name: '',
    activityType: 'กิจกรรม',
    province: '',
    district: '',
    subdistrict: '',
    village: '',
    houseNumber: '',
    farmingLocation: '',
    farmId: '',
    password: '',
    confirmPassword: '',
    showPassword: false
  });

  const [uploadedImages, setUploadedImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('ส่งข้อมูลสำเร็จ!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Menu className="w-6 h-6 text-gray-700" />
            <span className="text-2xl font-bold text-green-600">Phaktae</span>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-gray-700" />
            <Laptop className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Green Header Bar */}
      <div className="bg-green-800 text-white py-4 px-4">
        <div className="flex items-center gap-3">
          <ChevronLeft className="w-6 h-6" />
          <h1 className="text-xl font-bold">สมัครสมาชิก<br />เกษตรกร</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ชื่อ :
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
          />
        </div>

        {/* Activity Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white bg-green-800 px-3 py-2 rounded">
            กิจกรรม
          </label>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">จังหวัด :</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-200 text-sm"
            >
              <option value="">เลือก</option>
              <option value="กรุงเทพ">กรุงเทพมหานคร</option>
              <option value="เชียงใหม่">เชียงใหม่</option>
              <option value="ขอนแก่น">ขอนแก่น</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">อำเภอ :</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-200 text-sm"
            >
              <option value="">เลือก</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">ตำบล :</label>
            <select
              name="subdistrict"
              value={formData.subdistrict}
              onChange={handleInputChange}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-gray-200 text-sm"
            >
              <option value="">เลือก</option>
            </select>
          </div>
        </div>

        {/* Village and House Number */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">หมู่ :</label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">บ้านเลขที่ :</label>
            <input
              type="text"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
            />
          </div>
        </div>

        {/* Farming Location */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">ช่องทางติดต่อ :</label>
          <div className="flex gap-2">
            <select
              name="farmingLocation"
              value={formData.farmingLocation}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-200"
            >
              <option value="">เลือก</option>
              <option value="โทรศัพท์">โทรศัพท์</option>
              <option value="อีเมล">อีเมล</option>
              <option value="Line">Line</option>
            </select>
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-200"
            />
          </div>
          <button
            type="button"
            onClick={() => alert('เพิ่มช่องทางติดต่อ')}
            className="w-full mt-2 bg-green-700 text-white py-2 rounded font-medium hover:bg-green-800"
          >
            + เพิ่มช่องทางติดต่อ
          </button>
        </div>

        {/* Farm ID Upload */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">
            ใบรับรองหลักฐินครัว :
          </label>
          <input
            type="text"
            name="farmId"
            value={formData.farmId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 mb-2"
          />
          <div className="bg-gray-300 border-2 border-dashed border-gray-400 rounded-lg p-8 text-center">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-gray-600 mb-2" />
              <input
                id="imageUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {uploadedImages.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                อัพโหลดแล้ว {uploadedImages.length} ไฟล์
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => alert('เพิ่มใบรับรอง')}
            className="w-full mt-2 bg-green-700 text-white py-2 rounded font-medium hover:bg-green-800"
          >
            + เพิ่มใบรับรอง
          </button>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">รหัสผ่าน :</label>
          <input
            type={formData.showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">ยืนยันรหัสผ่าน:</label>
          <input
            type={formData.showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 mb-2"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="showPassword"
              checked={formData.showPassword}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">แสดงรหัสผ่าน</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-green-800 text-white py-4 rounded-lg text-lg font-bold hover:bg-green-900 transition-colors"
        >
          สมัครสมาชิกเกษตรกร
        </button>
      </div>
    </div>
  );
}