const { Worker } = require('bullmq');
const IORedis = require('ioredis');
require('dotenv').config();

const { sequelize, Message } = require('../models'); // <-- import sequelize
const callGemini = require('./gemini-api');

(async () => {
  try {
    // Connect to the DB
    await sequelize.authenticate();
    console.log('✅ Sequelize DB connected');

    // Redis connection
    const connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      tls: {}, // required for Upstash
    });

    // Create worker
    const worker = new Worker('message-queue', async job => {
      const { messageId, text } = job.data;

      try {
        const response = await callGemini(text);
        console.log("callGemini response:", response);

        const [updated] = await Message.update({ response }, { where: { id: messageId } });
        console.log(updated ? `✅ Message ${messageId} updated` : `❌ No message updated for ID ${messageId}`);

      } catch (err) {
        console.error(`❌ Failed to process message ${messageId}:`, err.message);
      }
    }, { connection, lockDuration: 30000 });

    console.log('🚀 Worker is running...');
  } catch (err) {
    console.error('❌ Worker failed to start:', err.message);
  }
})();
