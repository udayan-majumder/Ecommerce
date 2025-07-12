import { Router } from "express";
import { getPromoCodeDetails } from "../controller/promocode";

const router =Router()

router.get('/promocodes',getPromoCodeDetails)

export default  router;