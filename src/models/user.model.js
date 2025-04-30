import { model, Schema } from "mongoose"

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

export const userModel = model("User", userSchema);