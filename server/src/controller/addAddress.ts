import { Request, Response } from "express";
import pool from "../db/dbconfig";

interface AddressType {
  userId: number;
  Address: string;
}

export const addAddresses = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, Address }: AddressType = req.body;

  const getdata = await pool.query(
    "insert into useraddress(userid,address) values($1,$2)",
    [userId, Address]
  );
  return res.json({ "message": "Address added succesfully" });
};
