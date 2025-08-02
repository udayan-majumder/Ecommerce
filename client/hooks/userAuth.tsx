"use client"

import { redirect } from "next/navigation"
import { createContext,useContext, useState,useEffect } from "react"

interface User {
    userId:number,
    userName:string,
    Email:string,
    userType:string
}

interface UserContextType{
    user:User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)


export const useAuth = ()=>{
    const context  = useContext(UserContext);
    if(context === undefined){
        throw new Error('no user logged in')
    }
    return context;
}

export const UserProvider:React.FC<{children:React.ReactNode}>= ({children})=>{

const [user,setUser] = useState<User | null>(null)

const getUser = async () => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/user/getdetails`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    }
  );
  const res = await data.json();
  res.UserLogged? setUser(res.UserLogged) : setUser(null)
};

useEffect(() => {
  getUser();
}, []);



return(

    <UserContext.Provider value={{user,setUser}}>
    {children}
    </UserContext.Provider>
)

}