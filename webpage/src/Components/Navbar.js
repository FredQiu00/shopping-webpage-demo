import React, { useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
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
    <Navbar expand="lg" className="navbar navbar-dark">
      <Navbar.Brand href="/" className="brand">Fruit Market</Navbar.Brand>
      <div className='nav-buttons'>
        <Button className="admin-button" onClick={() => navigate('/login')}>
          Admin
        </Button>
        <Button className="cart-button" onClick={toggleCartVisibility}>
          Cart ({getTotalSum()})
        </Button>
      </div>
    </Navbar>
  );
};

export default NavBar;