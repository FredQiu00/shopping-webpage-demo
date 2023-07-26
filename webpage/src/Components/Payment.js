import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm';
import { Button } from 'react-bootstrap';

const Payment = ({ handleCheckout, totalPrice }) => {
  const stripePromise = loadStripe("pk_test_51NMB7fLcO6JdMybI1yj0kyFcDfTJEJpdgImyo9HKOkJxShD27hwCkRxfQCe2c98bQkYXCxWZydzXE7dSJ7erj7Mj00mLsBlDsR");
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const prepareForPayment = () => {
    setShowPaymentModal(true)
    fetch('http://localhost:8000/api/payment-intent', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: 'usd',
        amount: totalPrice,
        currCustomer: {name: 'Pika chu'}, // change this with a customer object
      }),
    }).then(async (res) => {
      console.log(res);
      const { clientSecret } = await res.json();
      setClientSecret(clientSecret);
    })
  }


  return(
    <>
    <Button
      className='checkout-button'
      onClick={prepareForPayment}
    >
      Check Out
    </Button>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            handleCheckout={ handleCheckout }
            showPaymentModal={ showPaymentModal }
            handleModalClose={() => setShowPaymentModal(false)}
          />
        </Elements>
      )}
    </>
  );
}

export default Payment;