import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import './CartDisplay.css';

const CartDisplay = ({ products }) => {
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

  const handleCheckout = async () => {
    if (cart.length > 0) {
      try {
        const updatePromises = [];

        for (const item of cart) {
          const { id, prod_name, description, price, quantity } = item;
          const product = products.find((product) => product._id === id);
          if (product) {
            const updatedQuantity = product.quantity - quantity;
            const updatePromise = fetch(`http://localhost:8000/api/products/${id}`, {
              method: 'PUT',
              body: JSON.stringify({ prod_name: prod_name, description: description, price: price, quantity: updatedQuantity }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
            updatePromises.push(updatePromise);
          }
        }
        await Promise.all(updatePromises);
        alert(`Checkout completed. Total price: $${totalPrice}`);
        clearCart();
      } catch (err) {
        alert('An error occurred during checkout. Please try again.');
      }

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
                  {number === 0 ? `Remove item` : number}
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
