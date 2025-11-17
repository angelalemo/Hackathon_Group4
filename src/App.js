import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from "./GlobalStyle";
import './App.css';
import Login from './frontend/Auth/Login/';
import Register from './frontend/Auth/Register/';      
import Navbar from './frontend/Navbar';
import  Home  from './frontend/Home/';
import NotFound from './frontend/NotFound';


function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
