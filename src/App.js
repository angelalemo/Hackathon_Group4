import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
