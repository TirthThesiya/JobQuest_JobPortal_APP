import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({});

const app = express();

//basic get api step
// app.get("/home",(req,res)=>{
//     return res.status(200).json({
//         message:"Welcome to home page",
//         success:true
//     })
// });

// Middleware
app.use(express.json());
app.use(express.urlencoded({extends:true}))
app.use(cookieParser())
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}
app.use(cors(corsOptions));




const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
});