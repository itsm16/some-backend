import {Router} from 'express'
import { feedbackModel } from '../models/feedback.model.js';
import jwt from 'jsonwebtoken'
import { userModel } from '../models/user.model.js';

const feedbackRouter = Router();


feedbackRouter.get("/feedback", async (req, res)=>{
    const allFeedbacks = await feedbackModel.find();
    res.json({
        allFeedbacks: allFeedbacks
    });
})

const checkToken = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {return res.json({message: "Not found, Login to give feedback", user: { name: null, email: null }})}

    const verifiedToken = await jwt.verify(token, process.env.SECRET);

    if (!verifiedToken) {return res.json({message: "Invalid user", user: { name: null, email: null }})}

    const user = await userModel.findById(verifiedToken.id)

    req.user = user;

    next();
}

feedbackRouter.post("/feedback", checkToken, async (req, res)=>{

    const {name, email, title, description} = req.body;
    if (!title | !description) {
        return res.json({message: "Couldn't record feedback"})
    }

    try {
        const createFeedback = await feedbackModel.create({
            name, email, title, description
        })
    } catch (error) {
        return res.json({
            message: "Something went wrong"
        })
    }

    res.json({
        status: "Feedback Recorded",
        message: `Welcome ${req.user.name}`
    })
})

export {feedbackRouter}
