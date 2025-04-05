import mongoose from "mongoose";

const connectDB = async () =>{
    await mongoose.connect(process.env.MONGODBURI)
}

export default connectDB;