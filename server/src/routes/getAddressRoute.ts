import { Router } from "express";
import { getAllAddress } from "../controller/getAddress";

const router = Router()

router.post('/getalladdress',getAllAddress)

export default router;