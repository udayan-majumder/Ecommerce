import { Request, Response } from "express";
import pool from "../db/dbconfig";

interface User {
  userId: number;
  productId?: number;
}

export const RemoveAllCartList = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, productId }: User = req.body;
  if (productId) {
    const remove = await pool.query("delete from usercart where userid=$1 and productId=$2", [
      userId,productId
    ]);

    return res.json({ message: "all items removed" });
  }
  const remove = await pool.query("delete from usercart where userid=$1", [
    userId,
  ]);
  return res.json({ message: "all items removed" });
};
