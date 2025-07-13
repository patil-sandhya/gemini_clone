const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { Subscription } = require('../models');
require('dotenv').config();
exports.createProSubscription = async (req, res) => {
  const priceId =  process.env.STRIPE_PRICE_ID
  try {
    const userId = req.user.id;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
      metadata: {
        userId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err);
    res.status(500).json({ success: false, message: 'Stripe error', error: err.message });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ where: { userId: req.user.id } });
    const tier = sub?.tier || 'basic';
    res.json({ success: true, tier });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get subscription status', error: err.message });
  }
};