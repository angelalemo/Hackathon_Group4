const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');

router.get('/', ChatController.getChatsByUser);
router.post('/', ChatController.createChat);
router.get('/:logID', ChatController.getMessages);
router.post('/message', ChatController.sendMessage);
router.delete('/:logID', ChatController.deleteChat);

module.exports = router;