const express = require('express');
const ejs = require('ejs');
const authRoutes = require('./src/routes/authRoutes');
const webhookRoutes = require('./src/routes/corbadoWebhookRoutes');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json())

const db = require("./models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.set('views', './src/views')
app.set('view engine', 'ejs');

app.use('/', authRoutes)
app.use('/', webhookRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
