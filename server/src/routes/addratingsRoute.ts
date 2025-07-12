import { Router } from "express";
import {AddRatings} from "../controller/addratings"

const router = Router()

router.post('/addrating',AddRatings)


export default router