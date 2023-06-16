import React, { useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { CartContext } from './CartContext';
import './Navbar.css';

const NavBar = () => {
  const { cart, toggleCartVisibility } = useContext(CartContext);

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
        <Button className="admin-button" onClick={() => window.open('/login', '_blank')}>
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