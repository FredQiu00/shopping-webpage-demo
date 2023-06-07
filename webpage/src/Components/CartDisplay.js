import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import './CartDisplay.css';

const CartDisplay = () => {
  const { cart, isCartVisible, toggleCartVisibility, clearCart, removeFromCart } = useContext(CartContext);

  if (!isCartVisible) {
    return null;
  }

  const handleClearCart = () => {
    clearCart();
  }

  const handleCloseCart = () => {
    toggleCartVisibility();
  }


  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = () => {
    if (cart.length > 0) {
      alert(`Checkout completed. Total price: $${totalPrice}`);
      clearCart();
    } else {
      alert('Your cart is empty.');
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    removeFromCart(index, newQuantity);
  };

  return (
    <div className="cart-display">
      <h2>Shopping Cart</h2>
      <div className="cart-description">
        <p>Item</p>
        <p>Unit Price</p>
        <p>Quantity</p>
      </div>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>{item.name}</p>
              <p>${item.price}</p>
              <select
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                id="quantity-select"
              >
                {[...Array(item.quantity + 1).keys()].map((number) => (
                <option key={number} value={number}>
                  {number === 0 ? (
                    <span>{number} (Remove item)</span>
                  ) : (
                    <span>{number}</span>
                  )}
                </option>
                ))}
              </select>
            </div>
          ))}
          <div className="total-price">
            <p>Total Price:</p>
            <p>${totalPrice}</p>
          </div>
        </>
      )}
      <div className="cart-buttons">
        <button className="clear-cart-button" onClick={handleClearCart}>
          Clear Cart
        </button>
        <button className="close-cart-button" onClick={handleCloseCart}>
          Close Cart
        </button>
        <button className="checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartDisplay;
