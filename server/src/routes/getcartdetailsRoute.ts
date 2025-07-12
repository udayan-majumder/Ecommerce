import { Router } from "express";
import { GetCartDetails } from "../controller/cartdetails";

const router = Router()

router.post('/getcartdetails',GetCartDetails)

export default router
