import {Router} from 'express'
import { getUserDetails } from '../controller/userDetails'
const router = Router()

router.post('/getdetails', getUserDetails)

export default router