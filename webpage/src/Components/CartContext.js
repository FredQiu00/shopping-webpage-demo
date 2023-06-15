import React, { useState } from 'react';

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product._id);
    if (existingItemIndex !== -1) {
      const updatedItems = [...cart];
      updatedItems[existingItemIndex].quantity++;
      setCart(updatedItems);
    } else {
      const newItem = { id: product._id, name: product.prod_name, price: product.price, quantity: 1 };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (index, newQuantity) => {
    if (newQuantity === 0) {
      const updatedCart = [...cart];
      updatedCart.splice(index, 1);
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart];
      updatedCart[index].quantity = newQuantity;
      setCart(updatedCart);
    }
  }

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    isCartVisible,
    toggleCartVisibility,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
