import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';
import './App.css';
import { GlobalStyle } from "./GlobalStyle";

function App() {
  return (
    <div className="App">
      <GlobalStyle />

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
