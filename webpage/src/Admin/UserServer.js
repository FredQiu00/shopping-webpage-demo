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

  const displayHistory = (id) => {
    navigate(`/admin/user/${id}/history`);
  }

  return (
    <div className="admin-container">
      <h2 className="admin-heading">User List</h2>
      <table className='info-table'>
        <thead>
          <tr>
            <th>id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Status</th>
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
              <td>{user.active ? 'Active' : 'Inactive'}</td>
              <td>
                <Button
                  className='action-button'
                  onClick={() => displayHistory(user._id)}
                >
                  Check
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="back-button" onClick={() => navigate('/admin')}>Back</Button>
      <Button className="logoff-button" onClick={() => navigate('/login')}>
        Log Off
      </Button>
    </div>
  );

};

export default UserServer;