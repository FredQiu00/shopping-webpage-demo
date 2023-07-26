import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Form, Button, Modal } from "react-bootstrap";

const CheckoutForm = (props) => {
  const {handleModalClose, showPaymentModal} = props
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const {error, paymentIntent} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}`
      },
      // redirect: "if_required",
    })

    if (error) {
      setMessage(error.message);
      console.log(message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log("Payment Succeed");
    } else {
      console.log("Unpredicted situation occurs.");
    }

    setIsProcessing(false);
  }

  return(
    <Modal show={showPaymentModal} onHide={handleModalClose}>
      <Modal.Header closeButton={true}>
        Payment Info
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
      <Modal.Body>
          <PaymentElement />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={isProcessing} type="submit">
          <span>
            {isProcessing ? 'Processing...' : 'Pay now'}
          </span>
        </Button>
      </Modal.Footer>
      </Form>
    </Modal>
  )

}

export default CheckoutForm;