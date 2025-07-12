import { Request,Response } from "express"; 
import pool from "../db/dbconfig";

export const getPromoCodeDetails = async(req:Request,res:Response):Promise<any>=>{

const promoCode = await pool.query("select * from promocodes") 

return res.json({"promocodes":promoCode.rows})
  

}