const UserController = require("./userController");
const jwt = require("jsonwebtoken");
const Corbado = require('corbado');
const corbado = new Corbado(process.env.PROJECT_ID, process.env.API_SECRET);

exports.home = function(req, res) {
    res.redirect('/login');
}

exports.login = function(req, res) {
    res.render('pages/login');
}

exports.profile = async function(req, res) {
    const token = req.cookies.jwt

    let userId
    await jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
        if (err) {
            // Handle invalid token error
            console.error(err);
            return res.redirect('/logout');
        } else {
            userId = decoded.userId;
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
}

exports.logout = function(req, res) {
    res.clearCookie('jwt', { path: '/' });
    res.redirect('/');
}

exports.authRedirect = async function(req, res) {
    let sessionToken = req.query.corbadoSessionToken;
    let clientInfo = corbado.utils.getClientInfo(req);

    corbado.sessionService.verify(sessionToken, clientInfo)
        .then(response => {
            let userData = JSON.parse(response.data.userData);

            let name = userData.userFullName;
            let email = userData.username;

            UserController.findByEmail(email)
                .then(user => {
                    if (!user) {
                        UserController.create(name, email)
                            .then(user => {
                                let token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                                res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

                                res.redirect('/profile');
                            })
                            .catch(err => {
                                console.error(err)
                                res.status(500).send('Server Error');
                            })
                    } else {
                        let token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

                        res.redirect('/profile');
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
}