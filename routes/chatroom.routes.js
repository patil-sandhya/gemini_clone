const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatroom.controller');
const auth = require('../middleware/auth.middleware');
const rateLimiter = require('../middleware/rateLimit.middleware');

router.post('/', auth, chatController.createChatroom);
router.get('/', auth, chatController.listChatrooms);
router.get('/:id', auth, chatController.getChatroom);
router.post('/:id/message', auth, rateLimiter, chatController.sendMessage);
router.get('/:id/messages', auth, chatController.getMessages);

module.exports = router;