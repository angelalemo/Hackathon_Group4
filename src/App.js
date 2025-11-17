import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';
import Home from './frontend/Home/Home';          
import Navbar from './frontend/Navbar';
import CreateFarm from './frontend/farmfeatures/CreateFarm'; //ใช้พิมพ์ใหญ่หรือพิมพ์เล็กเนี่ยน้องมาร์ค farmfeatures
import NotFound from './frontend/NotFound';
import Storage from './frontend/Storage';
import ProductManagement from './frontend/ProductManagement';

import { GlobalStyle } from "./GlobalStyle";
import './App.css';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/CreateFarm" element={<CreateFarm />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/products" element={<ProductManagement />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
