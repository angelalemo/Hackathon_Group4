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
- Hackathon organizers and mentors
