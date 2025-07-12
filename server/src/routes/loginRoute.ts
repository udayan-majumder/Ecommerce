import { Router } from "express";
import { LoginHandler } from "../controller/loginUser"

const router = Router()

router.post('/login',LoginHandler)

export default router