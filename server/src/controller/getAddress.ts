import { Request,Response } from "express";
import pool from "../db/dbconfig";


interface AddressType{
    userId:number
}

export const getAllAddress = async(req:Request,res:Response):Promise<any>=>{

    const {userId}:AddressType = req.body
    const getAddress = await pool.query('select * from useraddress where userid=$1',[userId])
    return res.json({"AddressList":getAddress.rows})
}