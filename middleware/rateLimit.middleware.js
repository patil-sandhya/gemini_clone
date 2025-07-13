const redis = require('../utils/redis');
const { Subscription } = require('../models');

module.exports = async function rateLimiter(req, res, next) {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const redisKey = `rate:${userId}:${today}`;

  try {
    // 1. Check if user is Pro
    const subscription = await Subscription.findOne({ where: { userId } });
    const isPro = subscription?.tier === 'pro';

    if (isPro) {
      return next(); // ✅ Pro user → unlimited
    }

    // 2. Get current count from Redis
    const count = await redis.get(redisKey);

    if (count && parseInt(count) >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Upgrade to Pro for unlimited access.',
      });
    }

    // 3. Increment the count
    await redis.multi()
      .incr(redisKey)
      .expire(redisKey, 24 * 60 * 60) // expire in 1 day
      .exec();

    next(); // ✅ Allowed
  } catch (err) {
    console.error('Rate limiter error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Error checking rate limit',
    });
  }
};
