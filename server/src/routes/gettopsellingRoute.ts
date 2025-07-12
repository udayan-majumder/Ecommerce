import { Router } from "express";
import {GetTopSelling} from "../controller/gettopselling"

const router = Router()

router.get('/topselling',GetTopSelling)


export default router