import {Router} from "express";
import { RegisterHandler } from "../controller/registerUser";

const router = Router()

router.post('/register',RegisterHandler)

export default router