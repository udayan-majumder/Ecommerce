import { Request, Response } from "express";
import pool from "../db/dbconfig";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { createHmac } from "crypto";
dotenv.config();

interface OrderType {
  Amount: number;
  Currency: string;
  Receipt?: string;
  UserId: number;
  UsercartList: any[]; // Replace 'any' with your actual cart item type
  TotalPrice: number;
  PaymentStatus: string;
  Time: number; // Timestamp in milliseconds (from date.getTime())
  CurrentAddress: string; // or a more complex object type if it's structured
  OrderStatus: string; // extend as neede
}

interface VerifyPaymentType {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID,
  key_secret: process.env.RAZORPAY_KEYSECRET,
});

export const GenerateOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      Amount,
      Currency,
      Receipt,
      UserId,
      UsercartList,
      TotalPrice,
      PaymentStatus,
      Time,
      CurrentAddress,
      OrderStatus,
    }: OrderType = req.body;
    const date = new Date();

    const order = {
      amount: Amount,
      currency: Currency,
      receipt:
        Receipt ||
        `Receipt_${date.getDate()}_${
          date.getMonth() + 1
        }_${date.getFullYear()}`,
      notes: {
        UserId: String(UserId),
        UsercartList: JSON.stringify(UsercartList), // convert to string if it's an object/array
        TotalPrice: String(TotalPrice),
        PaymentStatus,
        Time: String(Time),
        CurrentAddress,
        OrderStatus,
      },
    };

    const result = await instance.orders.create(order);

    return res.json({ createdOrder: result });
  } catch (err) {
   return res.json({"failed":err})
  }
};

export const VerifyPayment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  }: VerifyPaymentType = req.body;


  const generateSignature = createHmac("sha256", process.env.RAZORPAY_KEYSECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

  if(generateSignature !== razorpay_signature){
    return res.json({"message":"invalid payment"})
  }    

  const orderDetails = await instance.orders.fetch(razorpay_order_id)
  const {
  UserId,
  UsercartList,
  TotalPrice,
  PaymentStatus,
  Time,
  CurrentAddress,
  OrderStatus
}:any = orderDetails.notes;

JSON.parse(UsercartList).map(async(data:any)=>{
  const addItems = await pool.query("insert into userpayment values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",[UserId,data?.productid,data?.productdetails,data?.productdetails?.price,TotalPrice,razorpay_order_id,razorpay_payment_id,PaymentStatus,Time,CurrentAddress,OrderStatus,data?.qty])
  const removeqty = await pool.query("update products set qty=qty - $1 where id=$2",[data?.qty,data?.productid])
  const removeitem = await pool.query("delete from usercart where productid=$1 ",[data?.productid])
})

return res.redirect(`${process.env.CLIENT_URL}/user/products`)

};
