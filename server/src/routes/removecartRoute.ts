import {Router} from "express"
import { RemoveAllCartList } from "../controller/removecart"

const router = Router()

router.post('/removeall',RemoveAllCartList)

export default router