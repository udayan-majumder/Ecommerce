import { Request,Response } from "express";
import pool from "../db/dbconfig";

interface Addresstype{
    userId:number,
    addressId:number
}

export const DeletedAddress = async(req:Request,res:Response):Promise<any>=>{
    
    const {userId,addressId}:Addresstype = req.body

    const getResponse = await pool.query("delete from useraddress where userid= $1 and addressid=$2",[userId,addressId])
    console.log(getResponse.rows)
    return res.json({"message":"address deleted successfully"})
   
}