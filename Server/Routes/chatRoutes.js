const express = require('express');
const router = express.Router();
const verifyToken = require('../Middlewares/authMiddleware');
const { 
  initializeChat, 
  getUserChats, 
  getChatById,
  getChatMessages
} = require('../Controllers/chatControllers');

router.post('/initialize', verifyToken, initializeChat);

router.get('/user-chats', verifyToken, getUserChats);

router.get('/:chatId', verifyToken, getChatById);

router.get('/:chatId/messages', verifyToken, getChatMessages);

module.exports = router;