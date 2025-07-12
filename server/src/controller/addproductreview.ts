import { Request,Response } from "express";
import pool from "../db/dbconfig";

interface ProductReview {
  productid: number,
  userid: number,
  message: string
}

export const addReview = async(req:Request,res:Response):Promise<any> =>{
    const {productid,userid,message}:ProductReview = req.body

    const queryres = await pool.query("insert into productreview values($1,$2,$3)",[productid,userid,message])

    res.json({"message":"Review added succesfully"})
}