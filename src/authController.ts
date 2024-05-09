import { Request, Response } from 'express';
import {create, findById} from "./userService";
import {SDK, Config} from '@corbado/node-sdk';


const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;

const cboConfig = new Config(projectID!, apiSecret!);
const sdk = new SDK(cboConfig);

export function auth(req: Request, res: Response) {
    res.render('pages/login')
}

export async function saveUser(req: Request, res: Response) {
    const shortSession = req.cookies.cbo_short_session
    if (!shortSession) {
        res.redirect("/")
    }
    try {
        const user = await sdk.sessions().getCurrentUser(shortSession)
        const cboId = user.getID()
        const email = user.getEmail()
        const dbUser = await findById(cboId)
        if (!dbUser) {
            await create(cboId, email)
        }
        res.redirect("/profile")
    } catch(e) {
        console.log(e)
        res.redirect("/")
    }
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
        const dbUser = await findById(cboId)
        if (!dbUser) {
            throw Error("This user doesn't exist")
        }
        res.render('pages/profile', {cboId, email})
    } catch(e) {
        console.log(e)
        res.redirect("/")
    }
}