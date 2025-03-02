import express from 'express'
import { db } from './src/db.js';
import { userRouter } from './src/routes/userRoutes.js';
import { feedbackRouter } from './src/routes/feedbackRoutes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const PORT = process.env.PORT;
db();

app.use(cors({origin: process.env.ORIGIN, credentials: true}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use("/api", userRouter)
app.use("/api", feedbackRouter)


app.get("/", (req, res)=>{
    res.send("Running")
})

app.listen(PORT, ()=>{
    console.log("Running")
})