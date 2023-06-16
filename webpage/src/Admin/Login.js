import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simply check username and password are there
    if (username && password) {
      // Test here, change back to /admin later when new /admin page is done
      navigate('/admin/product');
    } else {
      setUsername('');
      setPassword('');
      alert("At least one field (username or password) is missing.");
    }
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <div className="input-field">
          <input type="text"
            placeholder='Username'
            value={username}
            onChange={e => setUsername(e.target.value)} />
          <input type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)} />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
