import { Router } from "express";
import { Products } from "../controller/getproducts";
const router = Router()

router.get('/products',Products)

export default router