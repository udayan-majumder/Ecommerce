import { Request, Response } from "express";
import pool from "../db/dbconfig";


export const GetCartDetails = async (
  req: Request,
  res: Response
): Promise<any> => {

  const { userId } = req.body;

  const productsRes = await pool.query(
    "select * from usercart where userid=$1 order by productid asc",
    [userId]
  );

  return res.json({ "list": productsRes.rows});
};
