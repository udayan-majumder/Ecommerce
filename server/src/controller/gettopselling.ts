import { Request,Response } from "express";
import pool from "../db/dbconfig";

export const GetTopSelling = async(req:Request,res:Response): Promise<any> =>{

 const queryRes = await pool.query('select productid,userproducts,count(*) from userpayment group by productid,userproducts order by count desc')

 res.json({"list":queryRes.rows})

}

