import { Router } from "express";
import { GenerateOrder } from "../controller/paymentGenerate";
import { VerifyPayment } from "../controller/paymentGenerate";

const router = Router()

router.post('/createorder',GenerateOrder)
router.post('/verifypayment',VerifyPayment)


export default router