const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const subController = require('../controllers/subscription.controller');

router.post('/pro', auth, subController.createProSubscription);
router.get('/status', auth, subController.getSubscriptionStatus);

module.exports = router;
