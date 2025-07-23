const { Worker } = require('bullmq');
const IORedis = require('ioredis');
require('dotenv').config();
const { Message } = require('../models');
const callGemini = require('./gemini-api');

// const connection = new IORedis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT || 6379,
//   maxRetriesPerRequest: null, 
// });

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}, // This is required for Upstash (uses HTTPS endpoint)
});

const worker = new Worker('message-queue', async job => {
  const { messageId, text } = job.data;

  try {
    const response = await callGemini(text);
    console.log("calll", response)
    await Message.update({ response }, { where: { id: messageId } });
    console.log(`Message ${messageId} processed`);
  } catch (err) {
    console.error(`Failed to process message ${messageId}:`, err.message);
  }
}, { connection, lockDuration: 30000  });

console.log('Worker is running...');
