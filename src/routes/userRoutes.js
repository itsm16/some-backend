import { Router } from "express";
import jwt from 'jsonwebtoken'
import { userModel } from "../models/user.model.js";
import {projectModel} from '../models/project.model.js'
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

        const token = await jwt.sign( {id: user._id}, process.env.SECRET); // pass id this way {id: user._id}, instead of (user.id, secret)
        
        res.cookie("token", token, {
            maxAge: 60000 * 60 * 24 * 5,
            httpOnly: true
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
    console.log(email)
    try {
        const user = await userModel.findOne({email});

        if(!user){ return res.status(404).json({
            message: "Not found",
            user: { name: null, email: null }
        })}

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){ return res.status(404).json({
            message: "Invalid credentials",
            user: { name: null, email: null }
        })}

        const token = await jwt.sign( {id: user._id}, process.env.SECRET, {expiresIn: "15s"});
        
        res.cookie("token", token, {
            maxAge: 60000 * 60 * 24 * 5,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        // console.log(token)

        res.json({
            state : "Logged in",
            message: `Welcome ${user.name}`,
            user: { name: user.name, email: user.email, token }
        })

    } catch (error) {
        throw error
    }
})

// new session

userRouter.post("/user", async (req, res)=>{
    // same as checkToken middleware

    const {token} = req.cookies;
    console.log(token);
    
    if (!token) {return res.json({message: "Not found, Login to give feedback", user: { name: null, email: null }})}
    
    const verifiedToken = await jwt.verify(token, process.env.SECRET);
        // console.log("id: ", verifiedToken.id);
    
    if (!verifiedToken) {return res.json({message: "Invalid user", user: { name: null, email: null }})}
    
    const user = await userModel.findById(verifiedToken.id)
        // console.log("middleware: ", user)

    return res.json({
        message: "User Exists",
        user: { name: user.name, email: user.email }
    })
})

{/*

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

// project
userRouter.post("/createProject",async (req, res)=>{
    const {project_name, project_description} = req.body;

    try {
        const query = await projectModel.create({project_name, project_description})

    return res.json({
        message: "created successfully"
    })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

userRouter.get("/projects", async (req, res)=>{
    try {
        const query = await projectModel.find()
    } catch (error) {
        
    }
})

export {userRouter};