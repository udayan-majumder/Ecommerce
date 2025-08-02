'use client'

import { useAuth } from "../../../../hooks/userAuth"
import { usePathname ,useRouter} from "next/navigation"
import { useEffect } from "react"
import { redirect } from "next/navigation"


function AdminPanelPage(){
const {user} = useAuth()
const pathname = usePathname()
const router = useRouter()


useEffect(() => {
  const path = localStorage.getItem("path") || pathname;
  const token = localStorage.getItem("token");

  if (!user || !token) {
    localStorage.setItem("path", pathname);
    router.push("/auth/login");
    return;
  }

  if (path.includes("/auth")) {
    router.push("/user/home");
    return;
  }

  if (path.includes("/admin")) {
    if (user?.userType === "admin") {
      router.push(path);
    } else {
      router.push("/user/home");
    }
    return;
  }

  router.push(path);
}, [user]);

// user && user?.userType === 'admin' ? localStorage.setItem("path", pathname) : router.push('/user/home')



return(
    <div></div>
)

}

export default AdminPanelPage