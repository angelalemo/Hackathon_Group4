import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';
import Home from './frontend/Home/Home';           // เพิ่ม import Home
// import Navbar from './frontend/Navbar';  // เพิ่ม import Navbar
import CreateFarm from './frontend/farmfeatures/CreateFarm';

import { GlobalStyle } from "./GlobalStyle";
import './App.css';

function App() {
  return (
    <Router>
      <GlobalStyle />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CreateFarm" element={<CreateFarm />} /> 
      </Routes>
    </Router>
  );
}

export default App;
