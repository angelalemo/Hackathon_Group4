import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';      
import Navbar from './frontend/Navbar';
import NotFound from './frontend/NotFound';
import Storage from './frontend/Storage';
import { GlobalStyle } from "./GlobalStyle";
import './App.css';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
