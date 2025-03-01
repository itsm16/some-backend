import {model, Schema} from 'mongoose'

const feedbackSchema = Schema({
    user_name: {
        type: String,
        required: false
    },
    email:{
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
})

const feedbackModel = model("feedback", feedbackSchema);

export {feedbackModel};