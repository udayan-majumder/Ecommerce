import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/dbconfig";
import dotenv from "dotenv";
dotenv.config();

interface User {
  email: string;
  password: string;
}

export const LoginHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password }: User = req.body;
    const userExsist = await pool.query(
      "select * from userinfo where email=$1",
      [email]
    );

    if (userExsist.rows.length === 0) {
      return res.json({ message: "wrong email" }).status(200);
    }
    const hassedpass = userExsist.rows[0].password;
    const passcheck: boolean = await bcrypt.compare(password, hassedpass);

    if (!passcheck) {
      return res.json({ message: "wrong password" });
    }

    const token = Jwt.sign(
      {
        userId: userExsist.rows[0].id,
        userName: userExsist.rows[0].username,
        Email: userExsist.rows[0].email,
        userType: userExsist.rows[0].usertype,
      },
      process.env.JWT_SECRET!
    );
    return res
      .json({
        token: token,
        User: {
          userId: userExsist.rows[0].id,
          userName: userExsist.rows[0].username,
          Email: userExsist.rows[0].email,
          userType: userExsist.rows[0].usertype,
        },
      })
      .status(200);
  } catch (err) {
    console.log(err);
    return res.json({ message: "server error" });
  }
};
