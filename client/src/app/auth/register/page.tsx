"use client";
import { Box ,Image, InputGroup,Input,Field,Text,Button,Link} from "@chakra-ui/react";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { useState,useEffect } from "react";
import { useAuth } from "../../../../hooks/userAuth";
import { redirect ,useRouter} from "next/navigation";
import toast,{Toaster} from "react-hot-toast";
import { usePathname } from "next/navigation";

function RegisterComponent(){
const[emailBorderColor,setemailBorderColor] = useState<string | null>('red')
const[userEmail,setuserEmail] = useState<string | null>(null)
const [usernameBorderColor, setusernameBorderColor] = useState<string | null>("red");
const [userName, setuserName] = useState<string | null>(null);
const [passwordBorderColor,setpasswordBorderColor] = useState<string | null>('red')
const[userPassword,setuserPassword] = useState<string |null>(null)
const [userRePassword, setuserRePassword] = useState<string | null>(null);
const [RegisterBtn, setRegisterBtn] = useState<string |null>("#8B4513");
const [divOpacity,setOpacity] = useState<number|null>(1)
const {user,setUser} = useAuth()
const pathname = usePathname()


const router = useRouter();


useEffect(()=>{
  if(user){
    return redirect("/user/home")
  }
},[user])


async function RegisterHandler() {
setOpacity(0.6)
const toastId = toast.loading('Registering',{removeDelay:3000})    
const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/register`,{
    method:'POST',
    headers:{
        'Content-type':'application/json'
    },
    body:JSON.stringify({
    "username": userName,
    "email": userEmail,
    "password": userPassword,
    "usertype": "user",
    })
})

const res = await data.json()
if(res.status===401){
    toast.remove(toastId)
    setOpacity(1)
    return toast.error('User Already Exsists Try Different Mail')
}
toast.success('User Sucessfully Registered')
toast.remove(toastId)
setOpacity(1)
setTimeout(() => {
  return redirect('/auth/login')
}, 1000);

}

   return (
       <Box height={["100vh"]} width={["100%"]} display={["flex"]} flexDirection={["column","row"]} justifyContent={["space-between","center"]} alignItems={["center"]} bgColor={["whiteAlpha.950"]} opacity={`${divOpacity}`}>
         <Toaster/>
        <Box height={["40%","100%"]} width={["100%","40%"]} className="flexed"> 
        <Image src={"/LoginCover.jpeg"} borderRadius={["10px"]} height={["95%"]} width={["95%"]}/>
        </Box>
       <Box height={["60%","95%"]} width={["100%","60%"]} className="flexed" flexDirection={["column"]} justifyContent={["start"]}  >
       <Box height={["20%"]} width={["90%"]} className="flexed" display={["none","flex"]} justifyContent={["right"]} alignItems={["start"]}><Image src={"/logo.jpeg"} height={["40%"]} borderRadius={["100px"]}/></Box>
       <Box height={["90%","60%"]} width={["80%","40%"]}  display={["flex"]} flexDirection={["column"]} justifyContent={["center"]} gap={["10px","20px"]} color={["#000"]} > 
        <Text width={["100%"]} fontSize={["30px","40px"]}fontFamily={["poppins"]} textAlign={["center"]}>
           Create an account
           <Text fontSize={["12px","16px"]} color={["#353535"]}>Please enter details below</Text>
       </Text>   
     <Box spaceY={[1,5]}>
        <InputGroup>
       <Field.Root >
           <Field.Label fontSize={["12px","18px"]} fontStyle={"italic"} letterSpacing={0.5}>Email</Field.Label>
           <Input fontFamily={["poppins"]} letterSpacing={["0.5px"]} bgColor={["#E7E4E4"]} border={"none"} placeholder="Enter your email"  onChange={(e)=>{
           setuserEmail(e.target.value)
          e.target.value.includes('@gmail.com')? setemailBorderColor('green'):setemailBorderColor('red')
            
           }} _focus={{border: `1px solid ${emailBorderColor}`}}></Input>
       </Field.Root>
       </InputGroup>

       <InputGroup>
       <Field.Root >
           <Field.Label fontSize={["12px","18px"]} fontStyle={"italic"} letterSpacing={0.5}>Username</Field.Label>
           <Input fontFamily={["poppins"]} letterSpacing={["0.5px"]} bgColor={["#E7E4E4"]} border={"none"} placeholder="Enter your username"  onChange={(e)=>{
           setuserName(e.target.value)
           e.target.value.length > 4 ? setusernameBorderColor('green'):setusernameBorderColor('red')
            
           }} _focus={{border: `1px solid ${usernameBorderColor}`}}></Input>
       </Field.Root>
       </InputGroup>
       
       <InputGroup>
       <Field.Root>
           <Field.Label fontSize={["12px","18px"]} fontStyle={"italic"} letterSpacing={0.5}>Password</Field.Label>
           <PasswordInput fontFamily={["poppins"]} letterSpacing={["0.5px"]} bgColor={["#E7E4E4"]} border={"none"} placeholder="Enter your password"  onChange={(e)=>{
             setuserPassword(e.target.value)
             e.target.value.length > 7 ? setpasswordBorderColor('green') : setpasswordBorderColor('red')
           }}    _focus={{border: `1px solid ${passwordBorderColor}`}} />
       </Field.Root>
       </InputGroup>
       
       <InputGroup>
       <Field.Root>
           <Field.Label fontSize={["12px","18px"]} fontStyle={"italic"} letterSpacing={0.5}>Re-Password</Field.Label>
           <PasswordInput fontFamily={["poppins"]} letterSpacing={["0.5px"]} bgColor={["#E7E4E4"]} border={"none"} placeholder="Re enter your password" onChange={(e)=>{
             setuserRePassword(e.target.value)
             e.target.value.length > 7 && e.target.value === userPassword ? setpasswordBorderColor('green') : setpasswordBorderColor('red')
           }}    _focus={{border: `1px solid ${passwordBorderColor}`}} />
       </Field.Root>
       </InputGroup>
     </Box>
       <Box spaceY={1}>
        <Button width={["100%"]} fontSize={["16px","20px"]} height={["40px","50px"]} letterSpacing={1} bgColor={`${RegisterBtn}`} fontWeight={600} color={["#fff"]} _hover={{bgColor:"#A0522D"}} onClick={()=>{
        if(userPassword !== userRePassword || !userEmail?.includes('@gmail') || !userName){
            return toast.error('either wrong password or email')
        }
         RegisterHandler()}} _focus={{}}>Sing Up</Button>
         <Text width={["100%"]} textAlign={["right"]}><Link href="/auth/login" color={["#424242"]} fontSize={["10px","14px"]} fontWeight={500} fontStyle={"italic"} borderBottom={["1px solid rgb(214, 213, 213)"]} _hover={{borderBottom:"none",color:"#000"}}>Have an account? Singin</Link></Text>
       </Box>
       
       </Box>
   
       </Box>
       </Box>
     )
   }


export default RegisterComponent