import {Router} from 'express'
import { feedbackModel } from '../models/feedback.model.js';
import jwt from 'jsonwebtoken'
import { userModel } from '../models/user.model.js';

const feedbackRouter = Router();


feedbackRouter.get("/feedbacks", async (req, res)=>{
    const allFeedbacks = await feedbackModel.find();
    res.json({
        allFeedbacks: allFeedbacks
    });
})

const checkToken = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {res.json({message: "Not found, Login to give feedback"})}

    const verifiedToken = await jwt.verify(token, process.env.SECRET);
    // console.log("id: ", verifiedToken.id);

    if (!verifiedToken) {res.json({message: "Invalid user"})}

    const user = await userModel.findById(verifiedToken.id)
    // console.log("middleware: ", user)

    req.user = user;
    // console.log("User: ", req.user);
    next();
}

feedbackRouter.post("/feedback", checkToken, async (req, res)=>{
    // console.log("From route: ", req.user);
    const {name, email, title, description} = req.body;

    try {
        const createFeedback = await feedbackModel.create({
            user_name: name, email, title, description
        })
    } catch (error) {
        throw error
        res.json({
            message: "Something went wrong"
        })
    }

    res.json({
        status: "Feedback Recorded",
        message: `Welcome ${req.user.name}`
    })
})

export {feedbackRouter}
