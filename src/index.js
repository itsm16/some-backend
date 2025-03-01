import express from 'express'
import { db } from './db.js';
import { userRouter } from './routes/userRoutes.js';
import { feedbackRouter } from './routes/feedbackRoutes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
db();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use("/api", userRouter)
app.use("/api", feedbackRouter)


app.get("/", (req, res)=>{
    res.send("Running")
})

app.post("/", (req, res)=>{
    console.log(req.body.feedback)
    res.json({
        msg: "Done"
    })
})

app.listen(3000, ()=>{
    console.log("Running on 3000")
})