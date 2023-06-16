import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {

  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <h1>Welcome to the Admin Portal</h1>
      <p>Select an option below to manage the respective sections.</p>
      <div className="admin-buttons">
        <Button className='prod-button' onClick={() => navigate('./product')}>
          Manage Product
        </Button>
        <Button className='user-button' onClick={() => navigate('./user')}>
          Manage User
        </Button>
      </div>
      <Button className='logoff-button' onClick={() => navigate('/login')}>
        Log off
      </Button>
    </div>
  )
};

export default Admin;