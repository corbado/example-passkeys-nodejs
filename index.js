const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const UserController = require('./src/controllers/UserController')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { Webhook, webhookMiddleware } = require('corbado-webhook');
const webhook = new Webhook();
var bodyParser = require('body-parser')

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

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// profile page
app.get('/profile', async function(req, res) {
    const token = req.cookies.jwt

    let userId
    await jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
        if (err) {
            // Handle invalid token error
            console.error(err);
            return res.redirect('/logout');
        } else {
            userId = decoded.userId; // Decoded user object from JWT
        }
    });

    UserController.findById(userId)
        .then(user => {
            if (!user) {
                res.redirect('/logout');
            } else {
                res.render('pages/profile', { username: user.email, userFullName: user.name });
            }
        })
});

// index page
app.get('/logout', function(req, res) {
    res.clearCookie('jwt', { path: '/' })
    res.redirect('/')
});

// redirect URL for auth
app.get('/auth/redirect', async function(req, res) {
    const sessionToken = req.query.corbadoSessionToken;
    const userAgent = req.get('user-agent');
    const remoteAddress = req.socket.remoteAddress

    axios.post('https://api.corbado.com/v1/sessions/verify',
        {
            "token": sessionToken,
            "clientInfo": {
                "remoteAddress": remoteAddress,
                "userAgent": userAgent
                },
        },
        {
            auth: {
                username: process.env.PROJECT_ID,
                password: process.env.API_SECRET,
            },
        })
        .then(response => {
        const data = JSON.parse(response.data.data.userData);
        const name = data.userFullName;
        const email = data.username;

        UserController.findByEmail(email)
            .then(user => {
                if (!user) {
                    UserController.create(name, email)
                        .then(user => {
                            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

                            res.redirect('/profile')
                        })
                        .catch(err => {
                            console.error(err)
                            res.status(500).send('Server Error');
                        })
                } else {
                    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

                    res.redirect('/profile')
                }
            })
            .catch(err => {
                console.error(err)
                res.status(500).send('Server Error');
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).send('Server Error');
        })
});

// Here you can define the webhook username and password that you also
// have set in the Corbado developer panel
app.post('/corbado-webhook', webhookMiddleware("webhookUsername", "webhookPassword"), async (req, res) => {
    try {
        // Get the webhook action and act accordingly. Every Corbado
        // webhook has an action.
        let request;
        let response;

        switch (webhook.getAction(req)) {

            // Handle the "authMethods" action which basically checks
            // if a user exists on your side/in your database.
            case webhook.WEBHOOK_ACTION.AUTH_METHODS: {
                request = webhook.getAuthMethodsRequest(req);
                // Now check if the given user/username exists in your
                // database and send status. Implement getUserStatus()
                // function below.
                const status = await getUserStatus(request.data.username);
                console.log("STATUS  ", status)
                response = webhook.getAuthMethodsResponse(status);
                res.json(response);
                break;
            }

            // Handle the "passwordVerify" action which basically checks
            // if the given username and password are valid.
            case webhook.WEBHOOK_ACTION.PASSWORD_VERIFY: {
                request = webhook.getPasswordVerifyRequest(req);

                // Now check if the given username and password is
                // valid. Implement verifyPassword() function below.
                const isValid = await verifyPassword(request.data.username, request.data.password)
                response = webhook.getPasswordVerifyResponse(isValid);
                res.json(response);
                break;
            }
            default: {
                return res.status(400).send('Bad Request');
            }
        }
    } catch (error) {

        // We expose the full error message here. Usually you would
        // not do this (security!) but in this case Corbado is the
        // only consumer of your webhook. The error message gets
        // logged at Corbado and helps you and us debugging your
        // webhook.
        console.log(error);

        // If something went wrong just return HTTP status
        // code 500. For successful requests Corbado always
        // expects HTTP status code 200. Everything else
        // will be treated as error.
        return res.status(500).send(error.message);
    }

});

async function getUserStatus(username) {
    const user = await UserController.findByEmail(username);
    if (!user) {
        return "not_exists";
    } else {
        return "exists";
    }
}

async function verifyPassword(username, password) {
    try {
        const user = await UserController.findByEmail(username);
        if (!user) {
            return false;
        }
        if (password === user.password) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
