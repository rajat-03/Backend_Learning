import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n Connected to MongoDb!!", ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Error in connecting MongoDB", error)
        process.exit(1)
    }
}

export default connectDB