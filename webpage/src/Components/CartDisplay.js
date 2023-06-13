import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './CartDisplay.css';

export const updateQuantity = (product, quantity) => {
  const updatePromise = fetch(`http://localhost:8000/api/products/${product._id}`, {
    method: 'PUT',
    body: JSON.stringify({ prod_name: product.prod_name, description: product.description, price: product.price, quantity: quantity }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return updatePromise;
}

const CartDisplay = ({ products, fetchProducts }) => {
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
          const { id, quantity } = item;
          const product = products.find((product) => product._id === id);
          if (product) {
            const updatedQuantity = product.quantity - quantity;
            if (updatedQuantity >= 0) {
              const updatePromise = updateQuantity(product, updatedQuantity);
              updatePromises.push(updatePromise);
            } else {
              alert(`Insufficient "${product.prod_name}" in stock.`);
            }
          }
        }
        if (updatePromises.length > 0) {
          await Promise.all(updatePromises)
          alert(`Checkout completed. Total price: $${totalPrice}`);
          clearCart();
          fetchProducts();
        }
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
    <Container fluid className={`cart-display ${isCartVisible ? 'open' : ''}`}>
      <h2>My Cart</h2>
      <Row className="cart-description">
        <Col xs={4}>Item</Col>
        <Col xs={4}>Unit Price</Col>
        <Col xs={4}>Quantity (lb)</Col>
      </Row>
      {cart.length === 0 ? (
        <Row>The cart is empty...</Row>
      ) : (
        <>
          {cart.map((item, index) => (
            <Row key={index} className="cart-item">
              <Col xs={4} className='item-name'>{item.name}</Col>
              <Col xs={4} className='item-price'>${item.price}</Col>
              <Col xs={4}>
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
              </Col>
            </Row>
          ))}
          <Row className="total-price">
            <Col xs={4}>Total Price:</Col>
            <Col xs={8}>${totalPrice}</Col>
          </Row>
        </>
      )}
      <Row className="cart-buttons">
        <Button variant="primary" className="checkout-button" onClick={handleCheckout}>Checkout</Button>
        <Button variant="warning" className="clear-cart-button" onClick={handleClearCart}>Clear</Button>
        <Button variant="secondary" className="close-cart-button" onClick={handleCloseCart}>Close</Button>
      </Row>
    </Container>
  );
};

export default CartDisplay;
