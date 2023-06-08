import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './Components/CartContext';
import NavBar from './Components/Navbar';
import ProductList from './Components/ProductList';
import CartDisplay from './Components/CartDisplay';
import Login from './Admin/Login';
import Admin from './Admin/Admin';
import './App.css';

function App() {
  const [products, setProducts] = React.useState([]);

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
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<>
              <NavBar />
              <ProductList products={ products } fetchProducts={ fetchProducts }/>
              <CartDisplay products={ products } fetchProducts={ fetchProducts }/>
            </>} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />}/>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
