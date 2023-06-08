import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import './Navbar.css';

const NavBar = () => {
  const { cart, toggleCartVisibility } = useContext(CartContext);
  const navigate = useNavigate();

  const getTotalSum = () => {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.quantity;
    });
    return sum;
  };

  return (
      <div className="nav-bar">
        <Button className="admin-button" onClick={() => navigate('/login')}>
          Admin
        </Button>
        <Button className="cart-button" onClick={toggleCartVisibility}>
          Cart ({getTotalSum()})
        </Button>
      </div>
  );
};

export default NavBar;
