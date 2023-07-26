const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_API_KEY);

app.post('/api/payment', async (req, res) => {
  const { amount, currency, description, paymentMethod, customer} = req.body;

  try {
    // Try to find the customer
    const customers = await stripe.customers.search({ query: `email:'${customer.email}'` });
    let targetCustomer;

    if (customers.data.length) {
      // If the customer exists, select it
      targetCustomer = customers.data[0];
    } else {
      // If not, create the customer
      targetCustomer = await stripe.customers.create(customer);
    }

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: currency,
      description: description,
      customer: customer.id,
      payment_method: paymentMethod.id,
      confirm: true
    });

    if (payment.status === 'succeeded') {
      res.json({
        orderId: payment.id,
        message: 'Payment successful',
        success: true,
      });
    } else if (payment.status === 'requires_action') {
      res.json({
        client_secret: payment.client_secret, // The client secret is used to continue the payment on the client side
        pm_id: paymentMethod.id,
        requires_action: true
      });
    } else {
      // The payment failed due to other unpredicted verification needed.
      res.json({ message: 'Additional verification required', success: false});
    }
  } catch (err) {
    console.log(err);
    res.json({ message: 'Payment failed', success: false });
  }
});
