const getItem = (item) => {
  return item;
}

app.post('/api/payment-intent', async(req, res) => {
  const { currency, amount, customer } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: getItem(currency),
      amount: getItem(amount),
      customer: getItem(customer),
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch(err) {
    return res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
});