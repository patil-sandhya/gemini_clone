const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// const connection = new IORedis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT || 6379,
//   maxRetriesPerRequest: null, //  required by BullMQ
//   tls: {},
// });

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}, // This is required for Upstash (uses HTTPS endpoint)
});

const messageQueue = new Queue('message-queue', { connection });

module.exports = { messageQueue };
