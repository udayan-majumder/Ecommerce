import pool from "../db/dbconfig";
import { Request,Response } from "express";



interface PaymentDetails{
   userId:number
}

export const getPaymentDetails = async(req:Request,res:Response):Promise<any> =>{
    
     const {userId}:PaymentDetails = req.body

   const getdetails = await pool.query("select * from userpayment where userid=$1 order by orderid",[userId]) 
   return res.json({"paymentlist":getdetails.rows})
}


