const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { pool } = require('../config/db');

router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = 'lkr' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      metadata: { user_id: req.user.id },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await pool.query(
        "UPDATE orders SET payment_status = 'paid', payment_id = ? WHERE payment_id = ? OR order_number = ?",
        [paymentIntent.id, paymentIntent.id, paymentIntent.metadata.order_number]
      );
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
