import { Response,Request } from "express";
import pool from "../db/dbconfig";

export const Products = async(req:Request,res:Response):Promise<any>=>{

    const data = await pool.query('select * from products order by id asc')
    const category = await pool.query('select distinct(category) from products;')
    if(!data){
        return res.json({"message":"empty"})
    }
    
    return res.json({"list":data,"category":category})

}
