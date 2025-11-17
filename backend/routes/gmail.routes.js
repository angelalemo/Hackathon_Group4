const express = require('express');
const router = express.Router();
const { sendEmailController } = require('../controllers/gmail.controller');

router.post('/Notification', sendEmailController);

module.exports = router;