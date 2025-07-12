import { Router } from "express";
import { addtoCart } from "../controller/addtocart";

const router = Router()

router.post('/addtocart',addtoCart)

export default router
