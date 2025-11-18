# Hackathon_Group4

# Phaktae 🌾

Platform connecting organic farmers directly with consumers, promoting transparency and trust in the organic agriculture supply chain.

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Testing Guide (Postman)](#api-testing-guide-postman)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## 🌟 About The Project

Farm Bridge is a web platform designed to bridge the gap between organic farmers and health-conscious consumers. It provides farmers with tools to showcase their farms, manage products, and communicate directly with customers, while consumers can discover verified organic farms, search for products, and connect with farmers.

### Key Objectives
- Create transparent and trustworthy farmer profiles
- Enable direct communication between farmers and consumers
- Provide advanced product search and filtering capabilities
- Support organic agriculture and local farming communities

---

## ✨ Features

### 🚜 For Farmers
- **Farm Profile Management**: Create and customize farm profiles with detailed information
- **Product Management**: Add, edit, and delete products with images and pricing
- **Media Gallery**: Upload images and videos showcasing farm operations
- **Certificate Management**: Display organic certifications and credentials
- **Direct Communication**: Chat directly with interested customers

### 🛒 For Consumers
- **Advanced Search**: Filter products by location, type, and price
- **Farm Discovery**: Browse verified organic farms with detailed profiles
- **Product Catalog**: View comprehensive product listings with images
- **Direct Messaging**: Contact farmers directly to ask questions
- **Location-based Search**: Find farms and products near you

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js v5.1.0
- **Database**: PostgreSQL 14
- **ORM**: Sequelize v6.37.7
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **Password Hashing**: bcrypt v6.0.0

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Create React App v5.0.1
- **HTTP Client**: Axios v1.13.2

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Development**: Nodemon v3.1.10
- **Logging**: Morgan v1.10.1

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Docker** (optional, for containerized setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Hackathon_Group4.git
   cd Hackathon_Group4
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE phaktae;
   ```

4. **Configure database connection**
   
   Edit `backend/config/db.js`:
   ```javascript
   const sequelize = new Sequelize(
     'phaktae',        // Database name
     'postgres',       // Your PostgreSQL username
     'your_password',  // Your PostgreSQL password
     {
       host: 'localhost',
       dialect: 'postgres'
     }
   );
   ```

5. **Set up environment variables** (optional)
   
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=postgres://postgres:password@localhost:5432/phaktae
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:4000`

2. **Start the frontend** (in a new terminal)
   ```bash
   npm start
   ```
   React app will run on `http://localhost:3000`

#### Production Mode

```bash
npm run build
npm start
```

#### Using Docker

```bash
docker compose up -d --build
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:4000
```

### Authentication Endpoints

#### Register User
```http
POST /users/register
```
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "type": true,  // true = Farmer, false = Customer
  "line": "string",
  "facebook": "string",
  "email": "string",
  "phoneNumber": "string"
}
```

**Response (201 Created):**
```json
{
  "NID": 1,
  "username": "farmer_john",
  "type": "Farmer",
  "email": "john@farm.com"
}
```

#### Login User
```http
POST /users/login
```
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "NID": 1,
  "username": "farmer_john",
  "type": "Farmer"
}
```

---

### Farm Endpoints

#### Get All Farms
```http
GET /farms/All
//ได้ทั้งfarm, รูปภาพ/วิดีโอ, ใบรับรอง, product
```
**ผลที่ได้ (200 OK):**
```json
[
    {
        "FID": 5,
        "NID": 1,
        "farmName": "สมบูรณ์ฟาร์ม",
        "line": "@sombunfarm",
        "facebook": "facebook.com/sombunfarm",
        "email": "farm@example.com",
        "phoneNumber": "0801112222",
        "description": "ฟาร์มเกษตรอินทรีย์",
        "lineToken": null,
        "lineUserId": null,
        "province": null,
        "district": null,
        "subDistrict": null,
        "location": null,
        "locationID": null,
        "User": {
            "NID": 1,
            "username": "testuser",
            "type": "Farmer",
            "email": "newemail@example.com",
            "phoneNumber": "0899999999"
        },
        "Storages": [
            {
                "file": "ตรงนี้จะได้เป็น url หรือ รูปหรือวิดีโอแบบbase 64",
                "typeStorage": "image หรือ video",
            }
        ],
        "Certificates": [
            {
                "institution": "test",
                "file": "รูปแบบbase 64",
            }
        ],
        "Products":
        [
            {
                "PID": 2,
                "productName": "มะเขือเทศ",
                "category": "ผักกินผล",
                "saleType": "1 กก.",
                "price": 150,
                "image": "https://example.com/image.jpg"
            },
            {
                "PID": 1,
                "productName": "ผัก",
                "category": "ผักใบเขียว",
                "saleType": "1 กก.",
                "price": 50,
                "image": "https://example.com/image.jpg"
            },
        ]
      },
  {
      "FID": 6,
      "NID": 3,
      //............................   
]
```
```http
GET /farms/AllwithProducts
//ได้ทั้งfarm, product
```
**ผลที่ได้ (200 OK):**
```json
[
    {
        "FID": 6,
        "NID": 1,
        "farmName": "Markfarm",
        "line": "Mark",
        "facebook": "Mark",
        "email": "marknarudon@gmail.com",
        "phoneNumber": "0843677079",
        "description": "1234",
        "lineToken": null,
        "lineUserId": "Uc58b0f5b9789156c962bfb0b9e64f340",
        "province": "เชียงใหม่",
        "district": "หางดง",
        "subDistrict": "สันผักหวาน",
        "location": null,
        "locationID": null,
        "Products": [
            {
                "PID": 1,
                "productName": "ผัก",
                "category": "ผักใบเขียว",
                "saleType": "1 กก.",
                "price": 50,
                "image": "https://example.com/image.jpg"
            },
            {
                "PID": 2,
                "productName": "มะเขือเทศ",
                "category": "ผักกินผล",
                "saleType": "1 กก.",
                "price": 150,
                "image": "https://example.com/image.jpg"
            }
        ]
    },
    {
        "FID": 2,
        "NID": 1,
      //............................   
]
```

#### Get Farm by ID or User
```http
GET /farms/:FID
GET /farms/user/:NID
//ได้ทั้งfarm, รูปภาพ/วิดีโอ, ใบรับรอง, product
```
**ผลที่ได้ (200 OK):**
```json
{
    "FID": 3,
    "NID": 1,
    "farmName": "สมบูรณ์ฟาร์ม",
    "line": "@sombunfarm",
    "facebook": "facebook.com/sombunfarm",
    "email": "farm@example.com",
    "phoneNumber": "0801112222",
    "description": "ฟาร์มเกษตรอินทรีย์",
    "lineToken": null,
    "lineUserId": null,
    "province": null,
    "district": null,
    "subDistrict": null,
    "location": null,
    "locationID": null,
    "User": {
        "NID": 1,
        "username": "testuser",
        "email": "newemail@example.com",
        "phoneNumber": "0899999999",
        "type": "Farmer"
    },
    "Storages": [],
    "Certificates": [],
    "Products": []
}
```
#### Get Farm by ID or User
```http
GET /farms/:FID/products
//ได้ทั้งfarm, product
```
**ผลที่ได้ (200 OK):**
```json
{
    {
    "FID": 3,
    "NID": 1,
    "farmName": "สมบูรณ์ฟาร์ม",
    "line": "@sombunfarm",
    "facebook": "facebook.com/sombunfarm",
    "email": "farm@example.com",
    "phoneNumber": "0801112222",
    "description": "ฟาร์มเกษตรอินทรีย์",
    "lineToken": null,
    "lineUserId": null,
    "province": null,
    "district": null,
    "subDistrict": null,
    "location": null,
    "locationID": null,
    "Products": []
}
}
```

#### Create Farm
```http
POST /farms/create
```
**ข้อมูลที่ต้องการ**
```json
{
  "NID": 1,
  "farmName": "Green Valley Farm",
  "line": "@greenfarm",
  "facebook": "greenfarm",
  "email": "contact@greenfarm.com",
  "phoneNumber": "0812345678",
  "description": "Organic vegetable farm",
  "province": "Chiang Mai",
  "district": "Mueang",
  "subDistrict": "Suthep",
  "location":"17/8",

  "storages": [
    {
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA", 
      "typeStorage": "image"
    }
  ],

  "certificates": [
    {
      "institution": "Organic Thailand",
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
    }
  ]
}
```
**ผลที่ได้ (201 Created):**
```json
{
    "message": "Farm created successfully",
    "farm": {
        "FID": 8,
        "NID": 1,
        "farmName": "Green Valley Farm",
        "line": "@greenfarm",
        "facebook": "greenfarm",
        "email": "contact@greenfarm.com",
        "phoneNumber": "0812345678",
        "description": "Organic vegetable farm",
        "lineToken": null,
        "lineUserId": null,
        "province": "Chiang Mai",
        "district": "Mueang",
        "subDistrict": "Suthep",
        "location": "17/8",
        "locationID": null
    }
}
```

#### Update Farm
```http
PUT /farms/updateInfo
```
**ข้อมูลที่ต้องการ**
```json
{
  "NID": 1,
  "FID": 1,
  "farmName": "Updated Farm Name",
  "description": "Updated description",
  "phoneNumber": "0801112222",
  "lineToken": null,
  "lineUserId": null,
  "province": "กรุงเทพ",
  "district": "เมือง",
  "subDistrict": "-",
  "location": null
       
}
```
**ผลที่ได้ (200OK):**
```json
{
    "message": "Farm updated successfully",
    "farm": {
        "FID": 1,
        "NID": 1,
        "farmName": "Updated Farm Name",
        "line": "@sombunfarm",
        "facebook": "facebook.com/sombunfarm",
        "email": "farm@example.com",
        "phoneNumber": "0801112222",
        "description": "Updated description",
        "lineToken": null,
        "lineUserId": null,
        "province": "กรุงเทพ",
        "district": "เมือง",
        "subDistrict": "-",
        "location": null,
        "locationID": null
    }
}
```
#### เพิ่มรูปใน farm
```http
PUT /farms/addStorage
``` 
**ข้อมูลที่ต้องการ**
```json
{
  "NID": 1,
  "FID": 1,
  "storages": [
    {
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" 
    },
    {
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
    }
  ]
}
```
**ผลที่ได้ (200OK):**
```
{
    "message": "Farm image added successfully",
    "farm": [
        {
            "id": 3,
            "FID": 1,
            "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
            "typeStorage": "image"
        },
        {
            "id": 4,
            "FID": 1,
            "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
            "typeStorage": "image"
        }
    ]
}
```
#### ลบรูปหรือวิดีโอ
```http
PUT /farms/deleteStorage
``` 
**ข้อมูลที่ต้องการ**
```json
{
  "NID": 1,
  "FID": 1,
  "storagesID": 3
}
```
**ผลที่ได้ (200OK):**
```
{
    "message": "Farm image deleted successfully",
    "farm": {
        "message": "Storage deleted successfully"
    }
}
```

---

### Product Endpoints

#### Get All Products by Farm
```http
GET /products?FID=1
```

#### Get Product by ID
```http
GET /products/:PID
```

#### Create Product
```http
POST /products
```
**Request Body:**
```json
{
  "NID": 1,
  "FID": 1,
  "productName": "Organic Tomato",
  "category": "Vegetables",
  "saleType": "Organic",
  "price": 50.00,
  "image": "base64_or_url"
}
```

#### Update Product
```http
PUT /products
```
**Request Body:**
```json
{
  "NID": 1,
  "PID": 1,
  "productName": "Updated Name",
  "price": 60.00
}
```

#### Delete Product
```http
DELETE /products
```
**Request Body:**
```json
{
  "NID": 1,
  "PID": 1
}
```

---

## 🧪 API Testing Guide (Postman)

คู่มือการทดสอบ API ด้วย Postman สำหรับทีมทดสอบ

### การเตรียมพร้อม

1. ติดตั้ง [Postman](https://www.postman.com/downloads/)
2. เปิดเซิร์ฟเวอร์ที่ `http://localhost:4000`
3. สร้าง Collection ใหม่ชื่อ "Phaktae API Tests"

---

### 🧑‍🌾 User Management Tests

#### Test 1: ลงทะเบียนผู้ใช้ใหม่ (Register User)

**Method:** `POST`  
**URL:** `http://localhost:4000/users/register`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "username": "farmer_john",
  "password": "securepassword123",
  "type": true,
  "line": "@farmerjohn",
  "facebook": "facebook.com/farmerjohn",
  "email": "john@farm.com",
  "phoneNumber": "0812345678"
}
```

**Expected Response (201):**
```json
{
  "NID": 6,
  "username": "farmer_john",
  "password": "$2b$10$7i81VbWxEFhEVTK6MdLVYOVFjM4HY7eYaZBgeQzrl1h1uzMUVX.fa",
  "type": "Farmer",
  "line": "@farmerjohn",
  "facebook": "facebook.com/farmerjohn",
  "email": "john@farm.com",
  "phoneNumber": "0812345678",
  "ProfileImage": null
}
```

**Test Points:**
- ✅ Status code เป็น 201
- ✅ Response มี NID
- ✅ type ถูกแปลงเป็น "Farmer"
- ✅ password ถูก hash

---

#### Test 2: เข้าสู่ระบบ (Login User)

**Method:** `POST`  
**URL:** `http://localhost:4000/users/login`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "username": "farmer_john",
  "password": "securepassword123"
}
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "NID": 6,
  "username": "farmer_john",
  "type": "Farmer",
  "phoneNumber": "0812345678",
  "email": "john@farm.com",
  "line": "@farmerjohn",
  "facebook": "facebook.com/farmerjohn",
  "FID": null,
  "farmName": null
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ Response มี token
- ✅ ข้อมูล user ถูกต้อง
- 💾 **บันทึก token และ NID ไว้ใช้ในการทดสอบต่อไป**

---

#### Test 3: ดูข้อมูลผู้ใช้ทั้งหมด (Get All Users)

**Method:** `GET`  
**URL:** `http://localhost:4000/users/All`

**Expected Response (200):**
```json
[
  {
    "NID": 1,
    "username": "yaya_updated",
    "type": "Farmer",
    "email": "yaya@example.com",
    "phoneNumber": "0999999999",
    "ProfileImage": null
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ Response เป็น array
- ✅ แต่ละ user มี NID, username, type

---

#### Test 4: ดูข้อมูลผู้ใช้ตาม ID (Get User by ID)

**Method:** `GET`  
**URL:** `http://localhost:4000/users/3`

**Expected Response (200):**
```json
{
  "NID": 3,
  "username": "Farmer stam",
  "type": "Farmer",
  "line": "line_id000",
  "facebook": "fb_id000",
  "email": "stam@example.com",
  "phoneNumber": "000000000",
  "ProfileImage": null,
  "Farms": []
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ NID ตรงกับที่ร้องขอ
- ✅ มี Farms array

---

#### Test 5: อัพเดทข้อมูลผู้ใช้ (Update User)

**Method:** `PUT`  
**URL:** `http://localhost:4000/users/update/6`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "username": "farmer_john_updated",
  "phoneNumber": "0887777777"
}
```

**Expected Response (200):**
```json
{
  "NID": 6,
  "username": "farmer_john_updated",
  "phoneNumber": "0887777777",
  "type": "Farmer",
  "email": "john@farm.com"
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ ข้อมูลที่ส่งไปถูกอัพเดท
- ✅ ข้อมูลอื่นๆ ไม่เปลี่ยนแปลง

---

### 🚜 Farm Management Tests

#### Test 6: ดูฟาร์มทั้งหมดแบบเต็ม (Get All Farms - Full)

**Method:** `GET`  
**URL:** `http://localhost:4000/farms/All`

**Expected Response (200):**
```json
[
  {
    "FID": 5,
    "NID": 1,
    "farmName": "สมบูรณ์ฟาร์ม",
    "line": "@sombunfarm",
    "email": "farm@example.com",
    "phoneNumber": "0801112222",
    "description": "ฟาร์มเกษตรอินทรีย์",
    "province": "เชียงใหม่",
    "district": "เมือง",
    "User": {
      "NID": 1,
      "username": "testuser"
    },
    "Storages": [],
    "Certificates": [],
    "Products": []
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ มี User, Storages, Certificates, Products
- ✅ Response เป็น array

---

#### Test 7: ดูฟาร์มทั้งหมดพร้อมสินค้า (Get All Farms with Products)

**Method:** `GET`  
**URL:** `http://localhost:4000/farms/AllwithProducts`

**Expected Response (200):**
```json
[
  {
    "FID": 6,
    "farmName": "Markfarm",
    "province": "เชียงใหม่",
    "Products": [
      {
        "PID": 1,
        "productName": "ผัก",
        "price": 50
      }
    ]
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ มี Products array
- ✅ ไม่มี Storages และ Certificates

---

#### Test 8: ดูฟาร์มตาม ID (Get Farm by ID)

**Method:** `GET`  
**URL:** `http://localhost:4000/farms/3`

**Expected Response (200):**
```json
{
  "FID": 3,
  "farmName": "สมบูรณ์ฟาร์ม",
  "User": {
    "NID": 1,
    "username": "testuser"
  },
  "Storages": [],
  "Certificates": [],
  "Products": []
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ FID ตรงกับที่ร้องขอ
- ✅ มีข้อมูลครบถ้วน

---

#### Test 9: ดูฟาร์มตามเจ้าของ (Get Farm by User)

**Method:** `GET`  
**URL:** `http://localhost:4000/farms/user/1`

**Expected Response (200):**
```json
[
  {
    "FID": 3,
    "NID": 1,
    "farmName": "สมบูรณ์ฟาร์ม"
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ NID ของฟาร์มตรงกับที่ร้องขอ
- ✅ Response เป็น array

---

#### Test 10: ดูสินค้าของฟาร์ม (Get Farm Products)

**Method:** `GET`  
**URL:** `http://localhost:4000/farms/3/products`

**Expected Response (200):**
```json
{
  "FID": 3,
  "farmName": "สมบูรณ์ฟาร์ม",
  "Products": [
    {
      "PID": 1,
      "productName": "ผักกาดหอม",
      "price": 50
    }
  ]
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ มี Products array
- ✅ ไม่มีข้อมูลอื่นๆ นอกจากฟาร์มและสินค้า

---

#### Test 11: สร้างฟาร์มใหม่ (Create Farm)

**Method:** `POST`  
**URL:** `http://localhost:4000/farms/create`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "farmName": "Green Valley Farm",
  "line": "@greenfarm",
  "facebook": "greenfarm",
  "email": "contact@greenfarm.com",
  "phoneNumber": "0812345678",
  "description": "ฟาร์มผักออร์แกนิกคุณภาพสูง",
  "province": "เชียงใหม่",
  "district": "เมือง",
  "subDistrict": "สุเทพ",
  "location": "17/8",
  "storages": [
    {
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
      "typeStorage": "image"
    }
  ],
  "certificates": [
    {
      "institution": "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ",
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
    }
  ]
}
```

**Expected Response (201):**
```json
{
  "message": "Farm created successfully",
  "farm": {
    "FID": 8,
    "NID": 1,
    "farmName": "Green Valley Farm",
    "province": "เชียงใหม่"
  }
}
```

**Test Points:**
- ✅ Status code เป็น 201
- ✅ Response มี FID ใหม่
- ✅ เฉพาะ Farmer เท่านั้นที่สร้างได้
- 💾 **บันทึก FID ไว้ใช้ในการทดสอบต่อไป**

---

#### Test 12: อัพเดทข้อมูลฟาร์ม (Update Farm)

**Method:** `PUT`  
**URL:** `http://localhost:4000/farms/updateInfo`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "FID": 8,
  "farmName": "Updated Farm Name",
  "description": "คำอธิบายฟาร์มใหม่ที่อัพเดทแล้ว",
  "phoneNumber": "0801112222",
  "province": "กรุงเทพมหานคร"
}
```

**Expected Response (200):**
```json
{
  "message": "Farm updated successfully",
  "farm": {
    "FID": 8,
    "farmName": "Updated Farm Name",
    "description": "คำอธิบายฟาร์มใหม่ที่อัพเดทแล้ว"
  }
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ ข้อมูลที่ส่งไปถูกอัพเดท
- ✅ เฉพาะเจ้าของฟาร์มเท่านั้นที่แก้ไขได้

---

#### Test 13: เพิ่มรูปภาพ/วิดีโอในฟาร์ม (Add Farm Storage)

**Method:** `PUT`  
**URL:** `http://localhost:4000/farms/addStorage`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "FID": 8,
  "storages": [
    {
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
      "typeStorage": "image"
    },
    {
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
      "typeStorage": "image"
    }
  ]
}
```

**Expected Response (200):**
```json
{
  "message": "Farm image added successfully",
  "farm": [
    {
      "id": 3,
      "FID": 8,
      "file": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
      "typeStorage": "image"
    },
    {
      "id": 4,
      "FID": 8,
      "file": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
      "typeStorage": "image"
    }
  ]
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ สามารถเพิ่มหลายรูปพร้อมกันได้
- ✅ แต่ละรูปมี id และ typeStorage
- 💾 **บันทึก storage id ไว้ใช้ทดสอบการลบ**

---

#### Test 14: ลบรูปภาพ/วิดีโอในฟาร์ม (Delete Farm Storage)

**Method:** `PUT`  
**URL:** `http://localhost:4000/farms/deleteStorage`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "FID": 8,
  "storagesID": 3
}
```

**Expected Response (200):**
```json
{
  "message": "Farm image deleted successfully",
  "farm": {
    "message": "Storage deleted successfully"
  }
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ รูปที่ระบุถูกลบ
- ✅ เฉพาะเจ้าของฟาร์มเท่านั้นที่ลบได้

---

### 🛒 Product Management Tests

#### Test 15: ดูสินค้าทั้งหมด (Get All Products)

**Method:** `GET`  
**URL:** `http://localhost:4000/products/All`

**Expected Response (200):**
```json
[
  {
    "PID": 1,
    "FID": 1,
    "productName": "Organic Tomato",
    "category": "Vegetable",
    "saleType": "retail",
    "price": 30,
    "image": "https://example.com/tomato.jpg"
  },
  {
    "PID": 2,
    "FID": 1,
    "productName": "Organic Cabbage",
    "category": "Vegetables",
    "saleType": "Organic",
    "price": 60,
    "image": "https://example.com/cabbage.jpg"
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ Response เป็น array
- ✅ แต่ละสินค้ามี PID, FID, productName, price

---

#### Test 16: ดูสินค้าตามฟาร์ม (Get Products by Farm)

**Method:** `GET`  
**URL:** `http://localhost:4000/products/farms/1`

**Expected Response (200):**
```json
[
  {
    "PID": 1,
    "FID": 1,
    "productName": "Organic Tomato",
    "category": "Vegetable",
    "price": 30
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ สินค้าทั้งหมดมี FID เท่ากับ 1
- ✅ Response เป็น array

---

#### Test 17: ดูสินค้าตาม ID (Get Product by ID)

**Method:** `GET`  
**URL:** `http://localhost:4000/products/2`

**Expected Response (200):**
```json
{
  "PID": 2,
  "FID": 1,
  "productName": "Organic Cabbage",
  "category": "Vegetables",
  "saleType": "Organic",
  "price": 60,
  "image": "https://example.com/cabbage.jpg"
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ PID ตรงกับที่ร้องขอ
- ✅ มีข้อมูลครบถ้วน

---

#### Test 18: สร้างสินค้าใหม่ (Create Product)

**Method:** `POST`  
**URL:** `http://localhost:4000/products/create`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "FID": 8,
  "productName": "มะเขือเทศอินทรีย์",
  "category": "ผักกินผล",
  "saleType": "1 กิโลกรัม",
  "price": 80,
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD"
}
```

**Expected Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "PID": 4,
    "FID": 8,
    "productName": "มะเขือเทศอินทรีย์",
    "category": "ผักกินผล",
    "saleType": "1 กิโลกรัม",
    "price": 80,
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD"
  }
}
```

**Test Points:**
- ✅ Status code เป็น 201
- ✅ Response มี PID ใหม่
- ✅ เฉพาะเจ้าของฟาร์มเท่านั้นที่สร้างได้
- 💾 **บันทึก PID ไว้ใช้ในการทดสอบต่อไป**

---

#### Test 19: อัพเดทสินค้า (Update Product)

**Method:** `PUT`  
**URL:** `http://localhost:4000/products/update`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "PID": 4,
  "productName": "มะเขือเทศอินทรีย์ Grade A",
  "price": 90
}
```

**Expected Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "PID": 4,
    "FID": 8,
    "productName": "มะเขือเทศอินทรีย์ Grade A",
    "category": "ผักกินผล",
    "price": 90
  }
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ ข้อมูลที่ส่งไปถูกอัพเดท
- ✅ เฉพาะเจ้าของฟาร์มเท่านั้นที่แก้ไขได้

---

#### Test 20: ลบสินค้า (Delete Product)

**Method:** `DELETE`  
**URL:** `http://localhost:4000/products/delete`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "PID": 4
}
```

**Expected Response (200):**
```json
{
  "message": "Product 4 deleted successfully"
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ สินค้าถูกลบจากระบบ
- ✅ เฉพาะเจ้าของฟาร์มเท่านั้นที่ลบได้

---

### 💬 Chat Management Tests

#### Test 21: สร้างห้องแชท (Create Chat)

**Method:** `POST`  
**URL:** `http://localhost:4000/chats/create`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "NID": 1,
  "FID": 5
}
```

**Expected Response (201):**
```json
{
  "message": "Chat created",
  "chat": {
    "logID": 1,
    "NID": 1,
    "FID": 5
  }
}
```

**Test Points:**
- ✅ Status code เป็น 201
- ✅ Response มี logID ใหม่
- ✅ มีการเชื่อมโยงระหว่าง User และ Farm
- 💾 **บันทึก logID ไว้ใช้ในการทดสอบต่อไป**

---

#### Test 22: ดูห้องแชททั้งหมดของผู้ใช้ (Get Chats by User)

**Method:** `GET`  
**URL:** `http://localhost:4000/chats/user/1`

**Expected Response (200):**
```json
[
  {
    "logID": 1,
    "NID": 1,
    "FID": 5,
    "Farm": {
      "FID": 5,
      "farmName": "Green Valley Farm"
    }
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ Response เป็น array
- ✅ แต่ละห้องมีข้อมูลฟาร์มที่เกี่ยวข้อง

---

#### Test 23: ส่งข้อความ (Send Message)

**Method:** `POST`  
**URL:** `http://localhost:4000/chats/message`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "logID": 1,
  "senderNID": 1,
  "messageText": "สวัสดีครับ สนใจสินค้าของฟาร์มครับ"
}
```

**Expected Response (201):**
```json
{
  "message": "Message sent",
  "data": {
    "timestamp": "2025-11-17T08:48:22.208Z",
    "messageID": 1,
    "logID": 1,
    "senderNID": 1,
    "messageText": "สวัสดีครับ สนใจสินค้าของฟาร์มครับ"
  }
}
```

**Test Points:**
- ✅ Status code เป็น 201
- ✅ Response มี messageID และ timestamp
- ✅ ข้อความถูกบันทึกในห้องแชทที่ถูกต้อง

---

#### Test 24: ดูข้อความทั้งหมดในห้องแชท (Get Messages)

**Method:** `GET`  
**URL:** `http://localhost:4000/chats/room/1/messages`

**Expected Response (200):**
```json
[
  {
    "messageID": 1,
    "logID": 1,
    "senderNID": 1,
    "messageText": "สวัสดีครับ สนใจสินค้าของฟาร์มครับ",
    "timestamp": "2025-11-17T08:48:22.208Z",
    "User": {
      "username": "yaya_updated"
    }
  }
]
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ ข้อความเรียงตามเวลา
- ✅ แต่ละข้อความมีข้อมูลผู้ส่ง

---

#### Test 25: ลบห้องแชท (Delete Chat)

**Method:** `DELETE`  
**URL:** `http://localhost:4000/chats/room/1`

**Expected Response (200):**
```json
{
  "message": "Chat 1 deleted"
}
```

**Test Points:**
- ✅ Status code เป็น 200
- ✅ ห้องแชทถูกลบจากระบบ
- ✅ ข้อความทั้งหมดในห้องถูกลบด้วย

---

### 🔍 การทดสอบ Error Cases

#### Test 26: ลงทะเบียนด้วย Username ซ้ำ

**Method:** `POST`  
**URL:** `http://localhost:4000/users/register`

**Body:**
```json
{
  "username": "farmer_john",
  "password": "password123",
  "type": true
}
```

**Expected Response (400):**
```json
{
  "error": "Username already exists"
}
```

**Test Points:**
- ✅ Status code เป็น 400
- ✅ Error message ชัดเจน

---

#### Test 27: เข้าสู่ระบบด้วยรหัสผ่านผิด

**Method:** `POST`  
**URL:** `http://localhost:4000/users/login`

**Body:**
```json
{
  "username": "farmer_john",
  "password": "wrongpassword"
}
```

**Expected Response (401):**
```json
{
  "error": "Invalid password"
}
```

**Test Points:**
- ✅ Status code เป็น 401
- ✅ ไม่มี token ถูกส่งกลับ

---

#### Test 28: สร้างฟาร์มโดย Customer

**Method:** `POST`  
**URL:** `http://localhost:4000/farms/create`

**Body:**
```json
{
  "NID": 6,
  "farmName": "Test Farm"
}
```

**หมายเหตุ:** NID 6 เป็น Customer

**Expected Response (400):**
```json
{
  "error": "Permission denied: Only farmers can create farms"
}
```

**Test Points:**
- ✅ Status code เป็น 400 หรือ 403
- ✅ ระบบตรวจสอบ permission

---

#### Test 29: สร้างสินค้าในฟาร์มที่ไม่ใช่เจ้าของ

**Method:** `POST`  
**URL:** `http://localhost:4000/products/create`

**Body:**
```json
{
  "NID": 2,
  "FID": 1,
  "productName": "Test Product",
  "price": 100
}
```

**หมายเหตุ:** NID 2 ไม่ใช่เจ้าของ FID 1

**Expected Response (400):**
```json
{
  "error": "Permission denied: You don't own this farm"
}
```

**Test Points:**
- ✅ Status code เป็น 400 หรือ 403
- ✅ ระบบตรวจสอบความเป็นเจ้าของ

---

#### Test 30: ดูฟาร์มที่ไม่มีอยู่

**Method:** `GET`  
**URL:** `http://localhost:4000/farms/99999`

**Expected Response (404):**
```json
{
  "error": "Farm not found"
}
```

**Test Points:**
- ✅ Status code เป็น 404
- ✅ Error message ชัดเจน

---

### 📊 Test Summary Checklist

#### User Management (5 tests)
- [ ] ลงทะเบียนผู้ใช้ใหม่
- [ ] เข้าสู่ระบบ
- [ ] ดูข้อมูลผู้ใช้ทั้งหมด
- [ ] ดูข้อมูลผู้ใช้ตาม ID
- [ ] อัพเดทข้อมูลผู้ใช้

#### Farm Management (9 tests)
- [ ] ดูฟาร์มทั้งหมดแบบเต็ม
- [ ] ดูฟาร์มทั้งหมดพร้อมสินค้า
- [ ] ดูฟาร์มตาม ID
- [ ] ดูฟาร์มตามเจ้าของ
- [ ] ดูสินค้าของฟาร์ม
- [ ] สร้างฟาร์มใหม่
- [ ] อัพเดทข้อมูลฟาร์ม
- [ ] เพิ่มรูปภาพ/วิดีโอ
- [ ] ลบรูปภาพ/วิดีโอ

#### Product Management (6 tests)
- [ ] ดูสินค้าทั้งหมด
- [ ] ดูสินค้าตามฟาร์ม
- [ ] ดูสินค้าตาม ID
- [ ] สร้างสินค้าใหม่
- [ ] อัพเดทสินค้า
- [ ] ลบสินค้า

#### Chat Management (5 tests)
- [ ] สร้างห้องแชท
- [ ] ดูห้องแชททั้งหมดของผู้ใช้
- [ ] ส่งข้อความ
- [ ] ดูข้อความทั้งหมดในห้องแชท
- [ ] ลบห้องแชท

#### Error Cases (5 tests)
- [ ] ลงทะเบียนด้วย Username ซ้ำ
- [ ] เข้าสู่ระบบด้วยรหัสผ่านผิด
- [ ] สร้างฟาร์มโดย Customer
- [ ] สร้างสินค้าในฟาร์มที่ไม่ใช่เจ้าของ
- [ ] ดูฟาร์มที่ไม่มีอยู่

**รวมทั้งหมด: 30 tests**

---

### 💡 Tips สำหรับการทดสอบ

1. **ใช้ Postman Environment Variables:**
   - สร้างตัวแปรสำหรับ `base_url`, `token`, `NID`, `FID`, `PID`
   - จะช่วยให้เปลี่ยน endpoint ได้ง่าย

2. **ใช้ Postman Tests Scripts:**
   ```javascript
   // ตัวอย่างการบันทึก token
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.token);
   pm.environment.set("NID", jsonData.NID);
   ```

3. **ทดสอบตามลำดับ:**
   - เริ่มจาก User Management
   - จากนั้น Farm Management
   - ตามด้วย Product Management
   - สุดท้าย Chat Management

4. **บันทึกผลการทดสอบ:**
   - สร้างเอกสาร Test Report
   - บันทึก bugs ที่พบ
   - รวบรวม screenshots

---

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  NID SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  type VARCHAR(50),  -- 'Farmer' or 'Customer'
  line VARCHAR(255),
  facebook VARCHAR(255),
  email VARCHAR(255),
  phoneNumber VARCHAR(255)
);
```

### Farms Table
```sql
CREATE TABLE farms (
  FID SERIAL PRIMARY KEY,
  NID INTEGER REFERENCES users(NID),
  farmName VARCHAR(255),
  line VARCHAR(255),
  facebook VARCHAR(255),
  email VARCHAR(255),
  phoneNumber VARCHAR(255),
  description TEXT,
  locationID INTEGER REFERENCES locations(locationID)
);
```

### Products Table
```sql
CREATE TABLE products (
  PID SERIAL PRIMARY KEY,
  FID INTEGER REFERENCES farms(FID),
  productName VARCHAR(255),
  category VARCHAR(255),
  saleType VARCHAR(255),
  price FLOAT,
  image TEXT
);
```

### Locations Table
```sql
CREATE TABLE locations (
  locationID SERIAL PRIMARY KEY,
  province VARCHAR(255),
  district VARCHAR(255),
  subDistrict VARCHAR(255)
);
```

### Storage Table
```sql
CREATE TABLE storages (
  id SERIAL PRIMARY KEY,
  FID INTEGER REFERENCES farms(FID),
  file TEXT,
  typeStorage VARCHAR(50)  -- 'image' or 'video'
);
```

### Certificates Table
```sql
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  FID INTEGER REFERENCES farms(FID),
  institution VARCHAR(255),
  file TEXT
);
```

### Chats Table
```sql
CREATE TABLE chats (
  logID SERIAL PRIMARY KEY,
  NID INTEGER REFERENCES users(NID),
  FID INTEGER REFERENCES farms(FID)
);
```

---

## 📁 Project Structure

```
Hackathon_Group4/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       ├── backend-cd.yml
│       ├── frontend-ci.yml
│       └── frontend-cd.yml
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── farm.controller.js
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── Certificate.js
│   │   ├── Chat.js
│   │   ├── Farm.js
│   │   ├── Location.js
│   │   ├── Product.js
│   │   ├── Storage.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   │   ├── farm.routes.js
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   └── service/
│       ├── farm.service.js
│       ├── product.service.js
│       ├── user.service.js
│       └── filter.service.js
├── public/
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── server.js
├── package.json
└── README.md
```

---

## 🔧 Development

### Code Architecture

The project follows a **3-layer architecture**:

1. **Routes Layer** (`routes/`): Handles HTTP requests and defines API endpoints
2. **Controller Layer** (`controllers/`): Processes requests, validates input, and coordinates responses
3. **Service Layer** (`service/`): Contains business logic and database operations

### Adding a New Feature

1. Create a new model in `backend/models/`
2. Add service methods in `backend/service/`
3. Create controller methods in `backend/controllers/`
4. Define routes in `backend/routes/`
5. Register routes in `server.js`

---

## 🧪 Testing

### Backend Tests
```bash
npm test
```

Tests are configured to run against a test PostgreSQL database.

### CI/CD Pipeline

- **Backend CI**: Runs on push to `test` branch
  - Installs dependencies
  - Runs database migrations
  - Executes tests

- **Backend CD**: Runs on push to `main` branch
  - Builds Docker image
  - Pushes to Docker Hub

- **Frontend CI/CD**: Similar workflow for React application

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is part of Hackathon Group 4.

---

## 👥 Team

**Hackathon Group 4**

---

## 📞 Support

For support, please open an issue in the GitHub repository.

---

## 🙏 Acknowledgments

- Organic farming communities in Thailand
- Open source libraries and frameworks used in this project
- Hackathon organizers and mentorsvvvvvv