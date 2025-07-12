import { Router } from "express";
import { getPaymentDetails } from "../controller/getpaymentdetails";

const router= Router()

router.post('/getpaymentdetails',getPaymentDetails)


export default router