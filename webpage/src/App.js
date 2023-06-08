import React from 'react';
import { CartProvider } from './Components/CartContext';
import Cart from './Components/Cart';
import ProductList from './Components/ProductList';
import CartDisplay from './Components/CartDisplay';
import './App.css';

function App() {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetchProducts();
  }, []);

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
      <div className="App">
        <Cart />
        <ProductList products={ products } fetchProducts = { fetchProducts }/>
        <CartDisplay products={ products } fetchProducts = { fetchProducts }/>
      </div>
    </CartProvider>
  );
}

export default App;
