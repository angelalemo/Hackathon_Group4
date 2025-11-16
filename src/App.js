import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';

import Home from './frontend/Home';           // เพิ่ม import Home
import Navbar from './frontend/Navbar';  // เพิ่ม import Navbar
import Storage from './frontend/Storage';
import ProductManagement from './frontend/ProductManagement';
// import PhaktaeWebsite from './PhaktaeWebsite';
import { GlobalStyle } from "./GlobalStyle";
import './App.css';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      {/* <PhaktaeWebsite /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/products" element={<ProductManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
