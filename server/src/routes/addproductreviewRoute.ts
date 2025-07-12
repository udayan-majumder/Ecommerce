import { Router } from "express";
import {addReview} from "../controller/addproductreview"

const router= Router()

router.post('/addproductreview',addReview)

export default router