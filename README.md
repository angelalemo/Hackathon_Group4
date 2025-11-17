
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
GET /farms
```
**Response (200 OK):**
```json
[
  {
    "FID": 1,
    "farmName": "Green Valley Farm",
    "description": "Organic vegetable farm",
    "Location": {
      "province": "เชียงใหม่",
      "district": "เมือง",
      "subDistrict": "สุเทพ"
    },
    "User": {
      "username": "farmer_john",
      "email": "john@farm.com"
    },
    "storages": ["image:base64...", "video:base64..."],
    "certificates": [
      {
        "institution": "Organic Thailand",
        "file": "base64..."
      }
    ]
  }
]
```

#### Get Farm by ID or User
```http

GET /farms/:farmID
GET /farms/user/:userNID
```

**URL Parameters:**
- `farmID` - ID ของฟาร์ม
- `userNID` - ID ของเกษตรกร (ดึงฟาร์มทั้งหมดของเกษตรกรคนนั้น)


#### Create Farm
```http
POST /farms
```
**Request Body:**
```json
{
  "NID": 1,
  "farmName": "Green Valley Farm",
  "line": "@greenfarm",
  "facebook": "greenfarm",
  "email": "contact@greenfarm.com",
  "phoneNumber": "0812345678",
  "description": "Organic vegetable farm",

  "locationID": 1,
  "storages": [
    {
      "file": "base64_or_url",
      "typeStorage": "image"
    }
  ],
  "certificates": [
    {
      "institution": "Organic Thailand",
      "file": "base64_or_url"

    }
  ]
}
```

#### Update Farm
```http
PUT /farms
```
**Request Body:**
```json
{
  "NID": 1,
  "FID": 1,
  "farmName": "Updated Farm Name",
  "description": "Updated description",
  "storages": [...],
  "certificates": [...]
}
```

---

### Product Endpoints

#### Get All Products by Farm
```http

GET /products/
```
**Query Parameters:**
- `FID` - Farm ID (optional, filter by specific farm)

**Response (200 OK):**
```json
[
  {
    "PID": 1,
    "productName": "Organic Tomato",
    "category": "Vegetables",
    "saleType": "Organic",
    "price": 50.00,
    "image": "base64_or_url",
    "FID": 1
  }
]

```

#### Get Product by ID
```http
GET /products/:PID
```


**URL Parameters:**
- `PID` - Product ID

**Response (200 OK):**
```json
{
  "PID": 1,
  "productName": "Organic Tomato",
  "category": "Vegetables",
  "saleType": "Organic",
  "price": 50.00,
  "image": "base64_or_url",
  "FID": 1,
  "Farm": {
    "farmName": "Green Valley Farm",
    "Location": {
      "province": "เชียงใหม่"
    }
  }
}
```

#### Create Product
```http
POST /products/
>>>>>>> dev
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


**Response (201 Created):**
```json
{
  "PID": 1,
  "productName": "Organic Tomato",
  "category": "Vegetables",
  "saleType": "Organic",
  "price": 50.00,
  "image": "base64_or_url",
  "FID": 1
}
```

#### Update Product
```http
PUT /products/

```
**Request Body:**
```json
{
  "NID": 1,
  "PID": 1,

  "productName": "Updated Product Name",
  "category": "Vegetables",
  "saleType": "Organic",
  "price": 60.00,
  "image": "base64_or_url"
}
```

**Response (200 OK):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "PID": 1,
    "productName": "Updated Product Name",
    "price": 60.00
  }

}
```

#### Delete Product
```http

DELETE /products/
```
**Request Body:**
```json
{
  "NID": 1,
  "PID": 1
}
```


**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
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

  FID INTEGER REFERENCES farms(FID) ON DELETE CASCADE ON UPDATE CASCADE,
  file TEXT,
  typeStorage VARCHAR(255)  -- 'image' or 'video'

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

=======
HACKATHON_GROUP4/
├── .github/
│   └── workflows/
│       ├── backend-cd.yml
│       ├── backend-ci.yml
│       ├── frontend-cd.yml
│       └── frontend-ci.yml
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── description/
│   │   ├── farm.controller.js
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   │
│   ├── models/
│   │   ├── Certificate.js
│   │   ├── Chat.js
│   │   ├── Farm.js
│   │   ├── Location.js
│   │   ├── Product.js
│   │   ├── Storage.js
│   │   ├── User.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── description/
│   │   ├── farm.routes.js
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   │
│   └── service/
│       ├── description/
│       ├── farm.service.js
│       ├── filter.service.js
│       ├── product.service.js
│       └── user.service.js
│
├── feature/
│
├── public/
│   ├── images/
│   │   ├── PhaktaeTG.png
│   │   ├── PhaktaeTW.png
│   │   ├── logo192.png
│   │   └── logo512.png
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── frontend/
│   │   └── Auth/
│   │       ├── Login/
│   │       │   └── index.js
│   │       └── Register/
│   │           └── index.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── GlobalStyle.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

---

## 🔧 Development

### Code Architecture

The project follows a **3-layer architecture**:

1. **Routes Layer** (`routes/`): Handles HTTP requests and defines API endpoints
   - `product.routes.js`: Defines product-related endpoints
   - `farm.routes.js`: Defines farm-related endpoints
   - `user.routes.js`: Defines authentication endpoints

2. **Controller Layer** (`controllers/`): Processes requests, validates input, and coordinates responses
   - `product.controller.js`: Handles product CRUD operations
   - `farm.controller.js`: Handles farm management
   - `user.controller.js`: Handles authentication and user management

3. **Service Layer** (`service/`): Contains business logic and database operations
   - `product.service.js`: Product business logic
   - `farm.service.js`: Farm business logic
   - `user.service.js`: User and authentication logic
   - `filter.service.js`: Search and filtering logic

### Route Definitions

#### Product Routes (product.routes.js)
```javascript
router.get("/", ProductController.getAllByFarm);
router.get("/:PID", ProductController.getById);
router.post("/", ProductController.create);
router.put("/", ProductController.update);
router.delete("/", ProductController.delete);
```


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

=======
- Hackathon organizers and mentors
>>>>>>> dev
