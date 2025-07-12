import { Router } from "express";
import { DeletedAddress } from "../controller/deleteAddress";

const router = Router()

router.post('/deleteaddress',DeletedAddress)

export default router
