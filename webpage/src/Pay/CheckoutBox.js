import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { getCountry, getCountryByAbbreviation } from 'country-currency-map';
import { getNames, getCode } from 'country-list';
import './CheckoutBox.css';

const CheckoutBox = ({ user, totalPrice, handleCheckout }) => {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [country, setCountry] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  const countries = getNames();

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
      const convertedCountry = getCountryByAbbreviation(country);
      const currency = getCountry(convertedCountry).currency.toLowerCase();
      const paymentData = {
          amount: Math.round(totalPrice), // Amount to charge in cents
          paymentMethod: paymentMethod,
          name: `${firstName} ${lastName}`,
          currency: currency,
          description : user ? `${user.username} purchased` : 'Guest purchase',
          email: email,
          phone: phone,
          zipCode: zipCode,
        }

        handleCheckout(paymentData, stripe); // Call your handleCheckout function here
        setShow(false);
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
            <div className="name-field">
                <Form.Group controlId="formFirstName" className="half-width-input">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formLastName" className="half-width-input">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </Form.Group>
              </div>
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
              <div className="location-field">
                <Form.Group controlId="formCountry" className="half-width-input">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required>
                    <option value="">Select a country</option>
                    {countries.map((c, index) => (
                      <option key={index} value={getCode(c)}>
                        {c}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formZipCode" className="half-width-input">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="number"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter your zip code" required
                  />
                </Form.Group>
              </div>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={user ? '' : "Enter your email"}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                  placeholder={user ? '' : "Enter your phone number"}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="payment-form-button">
                Proceed with payment
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
