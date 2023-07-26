import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { getCountry, getCountryByAbbreviation } from 'country-currency-map';
import { getNames, getCode } from 'country-list';
import Payment from '../Components/Payment';
import './CheckoutBox.css';

const CheckoutBox = ({ user, totalPrice, handleCheckout }) => {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [country, setCountry] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const countries = getNames();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let convertedCountry = '';
  let currency = '';


  const paymentData = {
    amount: Math.round(totalPrice), // Amount to charge in cents
    currency: currency,
    customer: {
      email: email,
      phone: phone,
      name: `${firstName} ${lastName}`,
    },
  }

  return (
    <>
      <Button variant="primary" className="checkout-button" onClick={handleShow}>
        Checkout
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title className="payment-title">Secure Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="payment-container">
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
          </div>
          <Payment
            handleCheckout={handleCheckout}
            totalPrice={parseInt(totalPrice * 100)}
            paymentData={paymentData}
            showPaymentModal={showPaymentModal}
            setShowPaymentModal={setShowPaymentModal}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary"
           className="payment-form-button"
           onClick={() => setShowPaymentModal(true)}>
            Proceed with payment
          </Button>
          <Button variant="secondary" className="close-button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CheckoutBox;
