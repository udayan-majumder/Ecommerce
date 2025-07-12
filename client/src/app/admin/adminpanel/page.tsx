'use client'

import { useAuth } from "../../../../hooks/userAuth"
import { usePathname ,useRouter} from "next/navigation"

function AdminPanelPage(){
const {user} = useAuth()
const pathname = usePathname()
const router = useRouter()

if(!user && user?.userType!== 'admin'){
    console.log(user)
localStorage.setItem("path",pathname)
router.push('/')
}
else{
    localStorage.setItem("path",'/user/home')
    router.push('/')
}

return(
    <div></div>
)

}

export default AdminPanelPage