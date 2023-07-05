import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './CheckoutBox.css';

const CheckoutBox = ({ user, totalPrice, handleCheckout }) => {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipCode, setZipCode] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return;
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log(paymentMethod);
      const response = await fetch('http://localhost:8000/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalPrice), // Amount to charge in cents
          paymentMethod: paymentMethod,
          name: `${firstName} ${lastName}`,
          description : user ? `${user.username} purchased` : 'Guest purchase',
          email: user ? user.email : 'guest@email.com',
          phone: user ? user.phone : '000000000',
          zipCode: zipCode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`${data.orderId}: ${data.message}`);
        setShow(false);
        handleCheckout(); // Call your handleCheckout function here
      } else {
        console.log('Payment failed');
      }
    }
  };

  return (
    <>
      <Button variant="primary" className="checkout-button" onClick={handleShow}>
        Checkout
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="payment-title">Secure Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="payment-container">
            <Form onSubmit={handleSubmit} className="payment-form">
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCardElement">
                <Form.Label>Card Information</Form.Label>
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    }
                  }}
                  className="StripeElement"
                />
              </Form.Group>
              <Form.Group controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control as="select" required>
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  {/* Add more country options */}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formZipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="number"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  max={99999}
                  placeholder="Enter your zip code" required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="payment-form-button">
                Pay
              </Button>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="close-button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CheckoutBox;
