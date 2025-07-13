// utils/redis.js
const Redis = require('ioredis');

if (!process.env.REDIS_URL) throw new Error('REDIS_URL not defined');

const redis = new Redis(process.env.REDIS_URL);

// dev-env
// const redis = new Redis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT || 6379,
//   maxRetriesPerRequest: null,
// });

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', err => console.error('Redis error:', err));

module.exports = redis;