import express from "express"
import {auth, saveUser, profile} from "./authController";

const router = express.Router();

router.get("/", auth)
router.get("/api/saveUser", saveUser)
router.get("/profile", profile)

export default router