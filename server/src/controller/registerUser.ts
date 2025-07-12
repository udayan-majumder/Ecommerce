import { Request, Response,RequestHandler } from "express";
import pool from "../db/dbconfig";
import bcrypt from "bcrypt";

interface User {
  username: string;
  email: string;
  password: string;
  usertype: string;
}

export const RegisterHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, email, password, usertype }: User = req.body;

    const userExsist = await pool.query(
      `select * from userinfo where email=$1`,
      [email]
    );
    if (userExsist.rows.length!==0) {
      return res.json({ message: "user exsists",status:401 });
    }
    const hassedpass = await bcrypt.hash(password, 10);
    const RegisterQuery = await pool.query(
      "insert into userinfo(username,email,password,usertype) values($1,$2,$3,$4)",
      [username, email, hassedpass, usertype]
    );
    return res.json({ message: "user registered succesfully" }).status(200);
  } catch (err) {
    console.log(err);
    return res.json({ message: "server error" });
  }
};
