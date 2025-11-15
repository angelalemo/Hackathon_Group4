const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');

router.get('/:NID', ChatController.getChatsByUser);
router.post('/create', ChatController.createChat);
router.get('/:logID', ChatController.getMessages);
router.post('/message', ChatController.sendMessage);
router.delete('/:logID', ChatController.deleteChat);

module.exports = router;