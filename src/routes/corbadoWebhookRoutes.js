const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/corbadoWebhookController');
const {webhookMiddleware} = require("corbado-webhook");
require('dotenv').config();

// Here you can define the webhook username and password that you also
// have set in the Corbado developer panel
router.post('/corbado-webhook', webhookMiddleware(process.env.WEBHOOK_USERNAME, process.env.WEBHOOK_PASSWORD), webhookController.webhook);

module.exports = router;
