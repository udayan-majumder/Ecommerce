import { Pool } from "pg";
import dotenv from "dotenv"
dotenv.config()

const pool:Pool= new Pool({
    connectionString:process.env.DATABASE_URL!,
    ssl:{
        rejectUnauthorized:false
    }
})

pool.connect(()=>{
    console.log("datbase is running")
})

export default pool