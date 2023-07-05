import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import SearchBar from './SearchBar';
import UserInfoTable from './UserInfoTable';
import './ServerManage.css';

const UserServer = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDB();
  }, []);

  const fetchDB = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
      });
      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">User List</h2>
      <SearchBar category="user" allProducts={allUsers}/>
      <UserInfoTable allUsers={allUsers} />
      <Button className="back-button" onClick={() => navigate('/admin')}>Back</Button>
      <Button className="logoff-button" onClick={() => navigate('/login')}>
        Log Off
      </Button>
    </div>
  );

};

export default UserServer;