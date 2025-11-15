import { useState } from "react";
import "./css/CreateFarm.css";

export default function CreateFarm() {
  const [form, setForm] = useState({
    farmName: "",
    line: "",
    facebook: "",
    email: "",
    phoneNumber: "",
    description: "",
    lineToken: "",
    lineUserId: "",
    province: "",
    district: "",
    subDistrict: "",
  });

  const [storages, setStorages] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // 🔹 แปลงไฟล์เป็น Base64
  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  // 🔹 อัปโหลดรูป/วิดีโอ
  const handleStorageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileToBase64(file, (base64) => {
      setStorages((prev) => [...prev, { file: base64 }]);
    });
  };

  // 🔹 อัปโหลดใบรับรอง
  const handleCertUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileToBase64(file, (base64) => {
      setCertificates((prev) => [...prev, { institution: "ไม่ระบุ", file: base64 }]);
    });
  };

  // 🔹 ส่งข้อมูลไป API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      storages,
      certificates,
    };

    console.log("📤 ส่งข้อมูลไป API:", payload);

    try {
      const response = await fetch("http://localhost:4000/farms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert("สร้างฟาร์มสำเร็จ!");
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("สร้างฟาร์มไม่สำเร็จ");
    }
  };

  // 🔹 อัปเดตค่า input ทั่วไป
  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="farmer-container">
      <div className="farmer-card">
        
        <h2 className="farmer-title">สร้างฟาร์ม</h2>

        <form className="farmer-form" onSubmit={handleSubmit}>

          <div className="farmer-group">
            <label>ชื่อฟาร์ม :</label>
            <input name="farmName" value={form.farmName} onChange={updateForm} />
          </div>

          <div className="farmer-group">
            <label>ที่อยู่ :</label>

            <div className="grid-3">
              <input name="province" placeholder="จังหวัด" onChange={updateForm} />
              <input name="district" placeholder="อำเภอ" onChange={updateForm} />
              <input name="subDistrict" placeholder="ตำบล" onChange={updateForm} />
            </div>
          </div>

          <div className="farmer-group">
            <label>ช่องทางติดต่อ :</label>

            <input name="phoneNumber" placeholder="เบอร์โทร" onChange={updateForm} />
            <input name="line" placeholder="LINE" onChange={updateForm} />
            <input name="facebook" placeholder="Facebook" onChange={updateForm} />
            <input name="email" placeholder="อีเมล" onChange={updateForm} />
          </div>

          <div className="farmer-group">
            <label>คำอธิบายฟาร์ม :</label>
            <textarea name="description" rows={4} onChange={updateForm} />
          </div>

          <div className="farmer-group">
            <label>รูปภาพ / วิดีโอ :</label>
            <div className="upload-box">
              <input type="file" accept="image/*,video/*" onChange={handleStorageUpload} />
            </div>
          </div>

          <div className="farmer-group">
            <label>ใบรับรอง :</label>
            <div className="upload-box">
              <input type="file" accept="image/*,application/pdf" onChange={handleCertUpload} />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            สมัครสมาชิกเกษตรกร
          </button>

        </form>
      </div>
    </div>
  );
}