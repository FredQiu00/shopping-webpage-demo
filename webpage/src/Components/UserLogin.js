import React, { useState, useContext } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './UserLogIn.css';

// Validate password
export const isValidPassword = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (!/\d/.test(password)) return 'Password must include at least one number.';
  if (!/[a-zA-Z]/.test(password)) return 'Password must include at least one letter.';
  return '';
}

// Validate email
export const isValidEmail = (email) => {
  // Simple pattern matching for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) ? '' : 'Email is not valid.';
}

// Validate phone number
export const isValidPhone = (phone) => {
  // Simple pattern matching for US phone number validation
  const phoneRegex = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
  return phoneRegex.test(phone) ? '' : 'Phone number is not valid.';
}

export const isMatchedPassword = (password, retypedPassword) => {
  return password === retypedPassword ? '' : 'Password does not match.'
}

const UserLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypedPassword, setRetypedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [retypedPasswordError, setRetypedPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const resetDefault = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setPhone('');
  }

  const handleShowSignUp = () => {
    resetDefault();
    setShowSignUp(true);
  }

  const handleShowLogIn = () => {
    resetDefault();
    setShowSignUp(false);
  }

  // Returning Customer sign in
  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(data => {
          if (data.status === 200) {
            setUser(data.body);
            navigate('/');
          } else {
            resetDefault();
            alert(data.body.error || "Username or password is incorrect.");
          }
        })
        .catch(() => {
          resetDefault();
          alert('Failed to authenticate.');
        });
    } else {
      resetDefault();
      alert("At least one field (username or password) is missing.");
    }
  };

  // Check sign up info
  const handleInputChange = (e, setState, setErrorState, validationFn) => {
    const newValue = e.target.value;
    setState(newValue);
    const validationError =
      validationFn === isMatchedPassword ? validationFn(password, newValue) : validationFn(newValue);
    setErrorState(validationError);
  };

  // New Customer sign up
  const handleSignUp = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!(username && password && email && phone)) {
      alert("Please fill all the fields.");
      return;
    }

    if (password !== retypedPassword) {
      alert("Passwords do not match each other.");
      return;
    }

    fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email, phone }),
    })
    .then(response => response.json()
      .then(data => {
        if (!response.ok) {
          throw new Error(data.error);
        }
        return data;
      }))
    .then(data => {
      if (data) {
        setUser(data);
        navigate('/');
        resetDefault();
      }
    })
    .catch(error => {
      alert(`Sign-up failed: ${error.message}`);
      resetDefault();
    });
  };

  return (
    <Container className="login-container">
      {!showSignUp ?
        <div className="form-box">
          <h2>Customer Page</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formUsername">
              <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign in
            </Button>
            <Button variant="link" onClick={handleShowSignUp}>
              No account before? Sign Up here.
            </Button>
          </Form>
        </div>
      :
        <div className='form-box'>
          <h2>New Customer</h2>
          <Form onSubmit={handleSignUp}>
            <span className='section'>User Info:</span>
            <Form.Group controlId="formUsername">
              <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control type="password" placeholder="Enter Password" value={password} onChange={e => handleInputChange(e, setPassword, setPasswordError, isValidPassword)} isInvalid={!!passwordError} />
              <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control type="password" placeholder="Confirm your Password" value={retypedPassword} onChange={e => handleInputChange(e, setRetypedPassword, setRetypedPasswordError, isMatchedPassword)} isInvalid={!!retypedPasswordError} />
              <Form.Control.Feedback type="invalid">{retypedPasswordError}</Form.Control.Feedback>
            </Form.Group>

            <span className='section'>Personal Info:</span>
            <Form.Group controlId="formEmail">
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => handleInputChange(e, setEmail, setEmailError, isValidEmail)} isInvalid={!!emailError} />
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Control type="text" placeholder="Enter phone number" value={phone} onChange={e => handleInputChange(e, setPhone, setPhoneError, isValidPhone)} isInvalid={!!phoneError} />
              <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign Up
            </Button>
            <Button variant="link" onClick={handleShowLogIn}>
              Have account before? Log in here.
            </Button>
          </Form>
        </div>
      }
    </Container>
  );
};

export default UserLogin;