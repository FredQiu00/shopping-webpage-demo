import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const UserInfoTable = ({ allUsers }) => {

  const navigate = useNavigate();
  const displayHistory = (id) => {
    navigate(`/admin/user/${id}/history`);
  }

  return (
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
  );
};

export default UserInfoTable;