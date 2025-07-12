import { Router } from "express";
import { addAddresses } from "../controller/addAddress";

const router = Router()

router.post('/addaddress',addAddresses)

export default router;