import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/dbconfig";
import userRouter from "./routes/registerRoute";
import userLogin from "./routes/loginRoute";
import userDetails from "./routes/userDetailsRoute";
import myproducts from "./routes/getproductsRoute";
import addtoCart from "./routes/addtocartRoute";
import cartDetails from "./routes/getcartdetailsRoute";
import removeAllItems from "./routes/removecartRoute";
import PromoCodes from "./routes/promocodesRoute";
import addAddress from "./routes/addAddressRoute";
import getAllAddress from "./routes/getAddressRoute";
import deleteAddress from "./routes/deleteAddressRoute";
import CreateOrder from "./routes/createOrderRoute";
import Verifypayment from "./routes/createOrderRoute";
import GetPaymentDetails from "./routes/getpaymentRoute";
import AddRatings from "./routes/addratingsRoute";
import AddReview from "./routes/addproductreviewRoute";
import GetReview from "./routes/getproductreviewRoute";
import GetTopSelling from "./routes/gettopsellingRoute";

dotenv.config();

const app: Express = express();
const PORT: number = process.env.PORT_URL ? Number(process.env.PORT_URL) : 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/user", userLogin);
app.use("/user", userDetails);
app.use("/user", addtoCart);
app.use("/user", cartDetails);
app.use("/user", removeAllItems);
app.use("/user", PromoCodes);
app.use("/user", addAddress);
app.use("/user", getAllAddress);
app.use("/user", deleteAddress);
app.use("/user", CreateOrder);
app.use("/user", Verifypayment);
app.use("/user", GetPaymentDetails);
app.use("/user", AddRatings);
app.use("/user", AddReview);
app.use("/user", GetReview);
app.use("/user", GetTopSelling);
app.use("/api", myproducts);

// app.get('/runscript',async(req:Request,res:Response):Promise<any>=>{
//   const response = await fetch("https://api.escuelajs.co/api/v1/products", {
//     method: "GET",
//     headers: {
//       "Content-type": "application/json",
//       Accept: "application/json",
//     },
//   });

//   const data = await response.json();
//   data?.map(async(items:any)=>{
//     const qry = await pool.query("insert into products(name,description,price,category,categoryid,qty,images) values($1,$2,$3,$4,$5,$6,$7)",[items?.title,items?.description,items?.price,items?.category?.name,items?.category?.id,100,{"image":items?.images}])
//   })

// return res.json({"message":"all products updated"})
// })

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
