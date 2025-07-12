import { Request,Response } from "express";
import pool from "../db/dbconfig";


interface RatingData{
    productid:number,
    userrating: number
}

export const AddRatings = async(req:Request,res:Response): Promise<any> =>{

const {productid,userrating}:RatingData = req.body

const queryres = await pool.query("select rating from products where id = $1",[productid])
const sum = Math.floor((queryres.rows[0].rating + userrating) / 2);
const newqueryres = await pool.query("update products set rating = $1 where id = $2",[sum,productid])

res.json({"message":"Ratings Added Successfully"})
}

