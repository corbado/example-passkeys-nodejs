import {Request, Response} from 'express';
import {SDK, Config} from '@corbado/node-sdk';
import {config as dotenvConfig} from "dotenv";

dotenvConfig()

const projectID = process.env.CORBADO_PROJECT_ID;
const apiSecret = process.env.CORBADO_API_SECRET;
const frontendAPI = process.env.CORBADO_FRONTEND_API;
const backendAPI = process.env.CORBADO_BACKEND_API;

const cboConfig = new Config(projectID!, apiSecret!, frontendAPI!, backendAPI!);
const sdk = new SDK(cboConfig);

export function auth(req: Request, res: Response) {
    res.render('pages/login')
}

export async function profile(req: Request, res: Response) {
    const sessionToken = req.cookies.cbo_session_token
    if (!sessionToken) {
        res.redirect("/")
    }

    try {
        const user = await sdk.sessions().validateToken(sessionToken)
        const userId = user.userId
        const fullName = user.fullName

        res.render('pages/profile', {userId, fullName})
    } catch (e) {
        console.log(e)
        res.redirect("/")
    }
}