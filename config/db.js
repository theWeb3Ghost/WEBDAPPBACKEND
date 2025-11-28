import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo connected");

    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;