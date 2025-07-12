import { Request, Response } from "express";
import pool from "../db/dbconfig";

interface ProductCartDetails {
  userId: number;
  productId: number;
  productDetails: object[];
  qty: number;
  addqty?:boolean
  removeqty?:boolean
}

export const addtoCart = async(req: Request, res: Response): Promise<any> => {

  const { userId, productId, productDetails, qty,addqty,removeqty}: ProductCartDetails = req.body;

  const userCartRes = await pool.query("select * from usercart where userid=$1 and productid = $2",[userId,productId])
   
  if(userCartRes.rows.length>0){
    if(addqty){
        const getRes = await pool.query("update usercart set qty=qty+1 where userid=$1 and productid=$2",[userId,productId])
        return res.json({"message":"quantity updated"})
    }

    if (removeqty){
      const getRes = await pool.query(
        "update usercart set qty= qty-1 where userid=$1 and productid=$2 and qty>1",
        [userId, productId]
      );
      return res.json({"message":"quantity removed"})

    }

    return res.json({"message":"already added to cart"})
  }

  const insertProduct = await pool.query("insert into usercart values($1,$2,$3,$4)",[userId,productId,productDetails,qty])
  return res.json({"message":"Product successfully added to the cart"}) 

};
