import { Request, Response } from "express";
import pool from "../db/dbconfig";

interface ProductReview {
  productid: number;
}

export const getReview = async (req: Request, res: Response): Promise<any> => {
  const { productid }: ProductReview = req.body;

  const queryres = await pool.query(
    "select * from productreview where productid=$1",
    [productid]
  );

  res.json({ "list": queryres.rows});
};
