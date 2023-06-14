import * as UserService from "../services/userService.js";
import {CorbadoSDK, Configuration} from '@corbado/nodejs';

const { AUTHENTICATION_URL: authenticationURL, PROJECT_ID: projectID, API_SECRET: apiSecret } = process.env;
const config = new Configuration(projectID, apiSecret);
config.authenticationURL = authenticationURL;
const corbado = new CorbadoSDK(config);

export const home = (req, res) => {
    res.redirect('/login');
}

export const login = (req, res) => {
    res.render('pages/login');
}

export const profile = async (req, res) => {
    const { authenticated, email } = await corbado.session.validateShortSessionValue(req);

    if (!authenticated) {
        return res.redirect('/logout');
    }

    try {
        const user = await UserService.findByEmail(email);
        if (!user) {
            res.redirect('/logout');
        } else {
            res.render('pages/profile', { username: user.email, userFullName: user.name });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

export const logout = (req, res) => {
    res.redirect('/');
}

export const authRedirect = async (req, res) => {
    try {
        const { email: username, name: userFullName } = await corbado.session.validateShortSessionValue(req);

        try {
            const user = await UserService.findByEmail(username);
            if (!user) {
                try {
                    const newUser = await UserService.create(userFullName, username);
                    console.log("Local user successfully created");
                    res.redirect('/profile');
                } catch (err) {
                    console.error(err);
                    res.status(500).send('Server Error');
                }
            } else {
                console.log("Local user already exists");
                res.redirect('/profile');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    } catch (err) {
        res.status(401).json({});
    }
}
