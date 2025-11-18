import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';
import Home from './frontend/Home/Home';          
import Navbar from './frontend/Navbar';
import NotFound from './frontend/NotFound';
import Storage from './frontend/Storage';
import ProductManagement from './frontend/ProductManagement';
import CreateFarm from './frontend/farmfeatures/CreateFarm';
=======
>>>>>>> frontend
import { GlobalStyle } from "./GlobalStyle";
import './App.css';
import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';      
import Navbar from './frontend/Navbar';
import  Home  from './frontend/Home/';
import NotFound from './frontend/NotFound';
import Createfarm from './frontend/Createfarm';
import FarmListPage from './frontend/Farm';
import Filter from './frontend/FilterPage';
import Product from './frontend/Product';
import ProductManagement from './frontend/ProductManagememt';
import ChatPage from './frontend/Chatfeatures';
import ChatList from './frontend/Chatfeatures/ChatList';


function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createfarm" element={<Createfarm />} />
        <Route path="/product/:PID" element={<Product />} />
        <Route path="/farms" element={<FarmListPage />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:logID/:FID" element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
