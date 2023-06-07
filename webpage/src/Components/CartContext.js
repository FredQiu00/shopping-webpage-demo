import React from 'react';

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = React.useState([]);
  const [isCartVisible, setIsCartVisible] = React.useState(false);

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(item => item.name === product.name);
    if (existingItemIndex !== -1) {
      const updatedItems = [...cart];
      updatedItems[existingItemIndex].quantity++;
      setCart(updatedItems);
    } else {
      const newItem = { name: product.name, price: product.price, quantity: 1 };
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

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartVisible, toggleCartVisibility, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
