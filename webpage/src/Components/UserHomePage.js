import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, Spinner, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { isValidEmail, isValidPhone, isValidPassword, isMatchedPassword } from './UserLogin';
import './UserHomePage.css';

const UserHomePage = ({ products }) => {
  const params = useParams();
  const userId = params.id;
  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // manage the visibility of the purchase history

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleLogOut = () => {
    logOut();
    localStorage.removeItem('user');
    navigate('/');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/users`);
        let users = await response.json();
        const targetUser = users.find(user => user._id === userId);
        if (targetUser) {
          setUserInfo(targetUser);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const calculateTotal = (session) => {
    return session.reduce((total, item) => {
      const [prod_name, quantity] = Object.entries(item)[0];
      const product = products.find(prod => prod.prod_name === prod_name);

      if (product) {
        return total + (product.price * quantity);
      } else {
        console.error(`Product ${prod_name} not found`);
        return total;
      }
    }, 0);
  }

  // Update User's info
  const [newEmail, setNewEmail] = useState('');
  const [newEmailError, setNewEmailError] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPhoneError, setNewPhoneError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleInfoChange = (e, setState, setErrorState, validationFn) => {
    const newValue = e.target.value;
    setState(newValue);
    const validationError =
      validationFn === isMatchedPassword ? validationFn(newPassword, newValue) : validationFn(newValue);
    setErrorState(validationError);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match each other.");
      return;
    }

    fetch(`http://localhost:8000/api/users/info/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: newEmail, phone: newPhone, password: newPassword }),
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setUserInfo(data);
          resetDefault();
          alert('Information updated successfully');
        }
      })
      .catch(error => {
        alert(`Failed to update user information: ${error.message}`);
        resetDefault();
      });
  };

  const resetDefault = () => {
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className='home-page-container'>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : userInfo ? (
        <>
          <div className="user-homepage">
            <h2 className='homepage-title'>{userInfo.username}'s Profile</h2>
            <p>id: #{userId}</p>
            <Button className='history-button' onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? 'Hide' : 'Show'} Purchase History
            </Button>
            {showHistory &&
              <div className='purchase-history'>
                <h3>Purchase History</h3>
                {userInfo.bought.length > 0 ? [...userInfo.bought].reverse().map((session, index) => (
                  <>
                    <div key={index} className="purchase-session">
                      {session.map((item, i) => (
                        Object.entries(item).map(([prod_name, quantity]) => (
                          <div key={i} className="purchased-item">
                            <img src={`${process.env.PUBLIC_URL}/images/${prod_name}.jpg`} alt={prod_name} />
                            <p>Quantity: {quantity}</p>
                          </div>
                        ))
                      ))}
                    </div>
                    <p className='summary'>Total spend: ${calculateTotal(session).toFixed(2)}</p>
                  </>
                )) :  <p className='no-history'>No purchase history...</p> }
              </div>
            }
            <Form className='change-info' onSubmit={handleInfoSubmit}>
              <h4>Change Personal Info:</h4>
              <Form.Group controlId="formEmail">
                <Form.Control type="email" placeholder="Enter new email" value={newEmail} onChange={e => handleInfoChange(e, setNewEmail, setNewEmailError, isValidEmail)} isInvalid={!!newEmailError} />
                <Form.Control.Feedback type="invalid">{newEmailError}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Control type="text" placeholder="Enter new phone number" value={newPhone} onChange={e => handleInfoChange(e, setNewPhone, setNewPhoneError, isValidPhone)} isInvalid={!!newPhoneError} />
                <Form.Control.Feedback type="invalid">{newPhoneError}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Control type="password" placeholder="Enter new password" value={newPassword} onChange={e => handleInfoChange(e, setNewPassword, setNewPasswordError, isValidPassword)} isInvalid={!!newPasswordError} />
                <Form.Control.Feedback type="invalid">{newPasswordError}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formConfirmPassword">
                <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => handleInfoChange(e, setConfirmPassword, setConfirmPasswordError, isMatchedPassword)} isInvalid={!!confirmPasswordError} />
                <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
            <div className="buttons-container">
              <Button variant="danger" onClick={handleShow}>Log out</Button>
              <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
            </div>
          </div>

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to log out?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleLogOut}>
                Log Out
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : null}
    </div>
  );
}

export default UserHomePage;
