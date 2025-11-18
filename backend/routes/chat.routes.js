const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');

router.get('/user/:NID', ChatController.getChatsByUser);
router.post('/create', ChatController.createChat);
router.get('/room/:logID/messages', ChatController.getMessages);
router.post('/message', ChatController.sendMessage);
router.delete('/delete/room/:logID', ChatController.deleteChat);

module.exports = router;
