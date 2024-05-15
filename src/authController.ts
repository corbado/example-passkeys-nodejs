import {Request, Response} from 'express';
import {SDK, Config} from '@corbado/node-sdk';
import {config as dotenvConfig} from "dotenv";

dotenvConfig()

const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;

const cboConfig = new Config(projectID!, apiSecret!);
const sdk = new SDK(cboConfig);

export function auth(req: Request, res: Response) {
    res.render('pages/login')
}

export async function profile(req: Request, res: Response) {
    const shortSession = req.cookies.cbo_short_session
    if (!shortSession) {
        res.redirect("/")
    }
    try {
        const user = await sdk.sessions().getCurrentUser(shortSession)
        const cboId = user.getID()
        const email = user.getEmail()
        res.render('pages/profile', {cboId, email})
    } catch (e) {
        console.log(e)
        res.redirect("/")
    }
}