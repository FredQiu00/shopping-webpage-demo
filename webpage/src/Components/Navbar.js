import React, { useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { UserContext } from './UserContext';
import './Navbar.css';

const NavBar = () => {
  const { cart, toggleCartVisibility } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const getTotalSum = () => {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.quantity;
    });
    return sum;
  };

  const handleUserClick = () => {
    if (user) {
      navigate(`/user/${user._id}`);
    } else {
      navigate('/user/login');
    }
  };

  return (
    <Navbar expand="lg" className="navbar navbar-dark">
      <Navbar.Brand href="/" className="brand">Fruit Market</Navbar.Brand>
      <div className='nav-buttons'>
        <Button className='user-login' onClick={handleUserClick}>
          {user ? user.username : 'Log in'}
        </Button>
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
