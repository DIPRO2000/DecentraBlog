import express from "express";
import dotenv from "dotenv";
import cors from "cors";


const app=express()

//dotenv
dotenv.config()

//cors
app.use(cors());

//Middlewares
app.use(express.json());

//Routes
import postcreationroute from "./routes/postcreationroute.js";


app.use("/api",postcreationroute);

//Test Route
app.get("/",(req,res)=>{
    res.status(200).send("Welcome From Server");
})

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Running on PORT:${PORT}`);
});


