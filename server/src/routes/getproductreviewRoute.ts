import { Router } from "express";
import {getReview} from "../controller/getproductreview"

const router= Router()

router.post('/getproductreview',getReview)

export default router