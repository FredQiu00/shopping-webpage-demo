import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    navigate('/admin');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <div className="input-field">
          <label>
            <span>Username:</span>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </label>
        </div>
        <div className="input-field">
          <label>
            <span>Password:</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
