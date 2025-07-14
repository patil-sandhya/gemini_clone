const { Chatroom, Message } = require('../models');
const { messageQueue } = require('../queue/queue');
const redis = require('../utils/redis');

exports.createChatroom = async (req, res) => {
  const { name } = req.body;
  const chatroom = await Chatroom.create({ name, userId: req.user.id });
  res.json({ success: true, chatroom });
};

exports.listChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.findAll({ where: { userId: req.user.id } });
  res.json({ success: true, chatrooms });
};

exports.getChatroom = async (req, res) => {
 const userId = req.user.id;
  const cacheKey = `chatrooms:${userId}`;

  try {
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log('Chatrooms served from cache');
      return res.status(200).json({
        success: true,
        fromCache: true,
        chatrooms: JSON.parse(cached),
      });
    }

    const chatrooms = await Chatroom.findAll({ where: { userId } });

    await redis.set(cacheKey, JSON.stringify(chatrooms), 'EX', 300); // 300s = 5 min

    res.status(200).json({
      success: true,
      fromCache: false,
      chatrooms,
    });
  } catch (err) {
    console.error('Chatroom fetch error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chatrooms',
    });
  }
};

exports.sendMessage = async (req, res) => {
  const { text } = req.body;
  const chatroomId = req.params.id;

  const message = await Message.create({
    userId: req.user.id,
    chatroomId,
    text,
    response: null, 
  });

  await messageQueue.add('processMessage', {
    messageId: message.id,
    text,
  });

  res.json({ success: true, message: 'Message queued for processing' });
};

// In chatroom.controller.js
exports.getMessages = async (req, res) => {
  const messages = await Message.findAll({
    where: { chatroomId: req.params.id },
    order: [['createdAt', 'ASC']]
  });

  res.json({ success: true, messages });
};
