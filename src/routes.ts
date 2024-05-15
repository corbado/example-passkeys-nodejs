import express from "express"
import {auth, profile} from "./authController";

const router = express.Router();

router.get("/", auth)
router.get("/profile", profile)

export default router