import { Router } from "express";
import jwt from 'jsonwebtoken'
import { userModel } from "../models/user.model.js"; // .js
import bcrypt from 'bcrypt'

const userRouter = Router();

userRouter.post("/signup", async (req, res)=>{
    const {name, email, password} = req.body;
    console.log({email, password})
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            name, email, password: hashedPassword
        })
        
        res.json({
            message: "User created"
        })
    } catch (error) {
        return error
    }
})

userRouter.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if(!user){res.json({
            message: "Not found"
        })}

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){res.json({
            message: "Invalid credentials"
        })}

        // user._id returns new objecId ()
        const token = await jwt.sign( {id: user._id}, process.env.SECRET); // pass id this way {id: user._id}, instead of (user.id, secret)
        res.cookie("token", token, {
            maxAge: 60000 * 60 * 24 * 5,
            httpOnly: true
        })

        // console.log(token)

        res.json({
            state : "Logged in",
            message: `Welcome ${user.name}`,
            user: {id: user.id, name: user.name, email: user.email }
        })

    } catch (error) {
        throw error
    }
})

// now while visiting

{/*
userRouter.post("/get-cookie", (req, res)=>{
    const token = jwt.sign(email, "shhh")
    res.cookie("cookieName", token, {maxAge: 60000 * 60 * 24 * 5, httpOnly: true});
    res.json({
        msg: "Runs"
    })
})

userRouter.get("/check-cookie", (req, res)=>{
    const {cookieName} = req.cookies;
    if(cookieName){
        res.json({
            cookies: cookieName
        })
    }else{
        res.json({
            msg: ""
        })
    }
})
*/}


export {userRouter};