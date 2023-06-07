import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { CartContext } from './CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, toggleCartVisibility } = useContext(CartContext);

  const getTotalSum = () => {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.quantity;
    });
    return sum;
  };

  return (
    <div className="cart">
      <Button className="cart-button" onClick={toggleCartVisibility}>
        Cart ({getTotalSum()})
      </Button>
    </div>
  );
};

export default Cart;
