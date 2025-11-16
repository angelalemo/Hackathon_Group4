import { useState, useEffect } from "react";
import "./css/CreateFarm.css";

export default function CreateFarm() {
  const [form, setForm] = useState({
    NID: "",
    farmName: "",
    line: "",
    facebook: "",
    email: "",
    phoneNumber: "",
    description: "",
    province: "",
    district: "",
    subDistrict: "",
    lineUserId: "",
    location: "",
  });

  const [storages, setStorages] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const clientId = process.env.REACT_APP_LINE_CHANNEL_ID;
  const redirectUri = process.env.REACT_APP_LINE_REDIRECT_URI;

  // ตรวจสอบ query param หลัง redirect กลับ
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lineUserId = params.get("lineUserId");
    console.log(lineUserId);
    const lineName = params.get("lineName");
    if (lineUserId) {
      setForm((prev) => ({ ...prev, lineUserId, line: lineName || prev.line }));

      // ลบ query param จาก URL เพื่อความสวยงาม
      const url = new URL(window.location);
      url.searchParams.delete("lineUserId");
      url.searchParams.delete("lineName");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  const handleLineLogin = () => {
    const state = "random_string";
    const scope = encodeURIComponent("profile openid");
    const responseType = "code";

    const lineLoginUrl = 
      `https://access.line.me/oauth2/v2.1/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

    window.location.href = lineLoginUrl;
  };

  const updateForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleStorageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    fileToBase64(file, (base64) => setStorages((prev) => [...prev, { file: base64 }]));
  };

  const handleCertUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    fileToBase64(file, (base64) => setCertificates((prev) => [...prev, { institution: "ไม่ระบุ", file: base64 }]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lineUserId) {
      alert("กรุณาเข้าสู่ระบบ LINE ก่อนส่งฟอร์ม");
      return;
    }

    const payload = { ...form, storages, certificates };
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

  return (
    <div className="farmer-container">
      <div className="farmer-card">
        <h2 className="farmer-title">สร้างฟาร์ม</h2>

        {!form.lineUserId && (
          <button onClick={handleLineLogin} className="btn-submit">
            เข้าสู่ระบบ LINE ก่อน
          </button>
        )}

        <form className="farmer-form" onSubmit={handleSubmit}>
          <div className="farmer-group">
            <label>ชื่อฟาร์ม :</label>
            <input name="farmName" value={form.farmName} onChange={updateForm} />
          </div>

          <div className="farmer-group">
            <label>ที่อยู่ :</label>
            <input name="location" placeholder="เลขที่บ้าน, หมู่, ซอยหรือถนน  " onChange={updateForm} />
            <div className="grid-3">
              <input name="subDistrict" placeholder="ตำบล" onChange={updateForm} />
              <input name="district" placeholder="อำเภอ" onChange={updateForm} />
              <input name="province" placeholder="จังหวัด" onChange={updateForm} />
            </div>
          </div>

          <div className="farmer-group">
            <label>ช่องทางติดต่อ :</label>
            <input name="phoneNumber" placeholder="เบอร์โทร" onChange={updateForm} />
            <input name="email" placeholder="อีเมล" onChange={updateForm} />
            <input name="line" placeholder="LINE" value={form.line} readOnly />
            <input name="facebook" placeholder="Facebook" onChange={updateForm} />
          </div>

          <div className="farmer-group">
            <label>คำอธิบายฟาร์ม :</label>
            <textarea name="description" rows={4} onChange={updateForm} />
          </div>

          <div className="farmer-group">
            <label>รูปภาพ/วิดีโอเกี่ยวกับฟาร์มและวิธีการปลูก :</label>
            <div className="upload-box">
              <input type="file" accept="image/*,video/*" onChange={handleStorageUpload} />
            </div>
          </div>

          <div className="farmer-group">
            <label>ใบรับรองผักอินทรีย์ :</label>
            <div className="upload-box">
              <input type="file" accept="image/*,application/pdf" onChange={handleCertUpload} />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            ยืนยันการสร้างฟาร์ม
          </button>
        </form>
      </div>
    </div>
  );
}
