import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
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

  const displayHistory = (id, history) => {
    navigate(`/admin/user/${id}/history`, { state: { history } });
  }

  return (
    <div className="admin-container">
      <table className='product-table'>
        <thead>
          <tr>
            <th>id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Purchase History</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <Button
                  className='check-history'
                  onClick={() => displayHistory(user._id, user.bought)}
                >
                  Check
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={() => navigate('/')}>Back</Button>
    </div>
  );

};

export default UserServer;