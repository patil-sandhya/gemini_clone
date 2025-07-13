const express = require('express');
require('dotenv').config();
const app = express();
const chatroomRoutes = require('./routes/chatroom.routes');
const authRoutes = require('./routes/auth.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const errorHandler = require('./middleware/errorHandler.middleware');
const { Subscription } = require('./models');

app.use('/webhook/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(errorHandler);

app.post('/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

   if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const stripeCustomerId = session.customer;
    const stripeSubscriptionId = session.subscription;

    try {
      await Subscription.upsert({
        userId,
        stripeCustomerId,
        stripeSubscriptionId,
        tier: 'pro',
      });

      console.log(`User ${userId} upgraded to Pro!`);
    } catch (err) {
      console.error('DB Save Error:', err.message);
    }
  }

  res.sendStatus(200);
});


app.use('/subscribe', subscriptionRoutes);
app.use('/auth', authRoutes);
app.use('/chatroom', chatroomRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
