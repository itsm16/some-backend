import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const db = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri);
        console.log("Connected to MongoDB!");

    } catch (error) {
        console.error("Error connecting to MongoDB or performing operations:", error);
    }
};

// db();

export { db };