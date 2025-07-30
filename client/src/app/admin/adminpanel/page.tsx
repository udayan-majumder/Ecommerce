'use client'

import { useAuth } from "../../../../hooks/userAuth"
import { usePathname ,useRouter} from "next/navigation"
import { useEffect } from "react"
import { redirect } from "next/navigation"


function AdminPanelPage(){
const {user} = useAuth()
const pathname = usePathname()
const router = useRouter()


  useEffect(()=>{
   if (!user) {
    localStorage.setItem("path", pathname);
    return redirect("/");
  }
  },[])
user && user?.userType === 'admin' ? localStorage.setItem("path", pathname) : router.push('/user/home')



return(
    <div></div>
)

}

export default AdminPanelPage