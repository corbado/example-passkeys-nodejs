import express from 'express';
import { webhook as webhookController } from '../controllers/corbadoWebhookController.js';
import Corbado, {Configuration} from '../../corbado-nodejs/src/index.js';
import dotenv from 'dotenv';

dotenv.config();

const { AUTHENTICATION_URL: authenticationURL, PROJECT_ID: projectID, API_SECRET: apiSecret, WEBHOOK_USERNAME: webhookUsername, WEBHOOK_PASSWORD: webhookPassword } = process.env;
const config = new Configuration(projectID, apiSecret);
config.authenticationURL = authenticationURL;

config.webhookUsername = webhookUsername;
config.webhookPassword = webhookPassword;
const corbado = new Corbado(config);

const router = express.Router();

router.post('/corbado-webhook', corbado.webhook.middleware, webhookController);

export default router;
