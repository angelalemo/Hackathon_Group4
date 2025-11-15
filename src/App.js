import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';

import Home from './frontend/pages/Home';           // เพิ่ม import Home
import Navbar from './frontend/components/Navbar';  // เพิ่ม import Navbar

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
      </Routes>
    </Router>
  );
}

export default App;
