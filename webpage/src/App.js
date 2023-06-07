import React from 'react';
import { CartProvider } from './Components/CartContext';
import Cart from './Components/Cart';
import ProductList from './Components/ProductList';
import CartDisplay from './Components/CartDisplay';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Cart />
        <ProductList />
        <CartDisplay />
      </div>
    </CartProvider>
  );
}

export default App;
