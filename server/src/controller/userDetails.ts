import {Request,Response} from 'express'
import  Jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


export const getUserDetails = async(req:Request,res:Response):Promise<any>=>{

const {token} = req.body

if(!token){
    return res.json({"UserLogged":null})
}

const user = Jwt.verify(token,process.env.JWT_SECRET!)
if(!user){
    return res.json({ UserLogged: null });
}

return res.json({"UserLogged":user})

}

