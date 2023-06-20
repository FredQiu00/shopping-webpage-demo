import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './Components/CartContext';
import { UserProvider } from './Components/UserContext';
import NavBar from './Components/Navbar';
import ProductList from './Components/ProductList';
import CartDisplay from './Components/CartDisplay';
import Footer from './Components/Footer';
import UserLogin from './Components/UserLogin';
import UserHomePage from './Components/UserHomePage';
import Login from './Admin/Login';
import Admin from './Admin/Admin';
import ProdServer from './Admin/ProdServer';
import UserServer from './Admin/UserServer';
import UserHistory from './Admin/UserHistory'
import Stat from './Admin/Statistic';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  const [products, setProducts] = useState([]);

  React.useEffect(() => {
    fetchProducts();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
      });
      let data = await response.json();
      data = data.filter((product) => product.quantity !== 0);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<>
                <NavBar />
                <ProductList products={ products } fetchProducts={ fetchProducts }/>
                <CartDisplay products={ products } fetchProducts={ fetchProducts }/>
                <Footer />
              </>} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/:id" element={<UserHomePage products={ products }/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/product" element={<ProdServer />} />
              <Route path="/admin/product/stats" element={<Stat />} />
              <Route path="/admin/user" element={<UserServer />} />
              <Route path="/admin/user/:id/history" element={<UserHistory />}/>
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
