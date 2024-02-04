import connectDB from "./db/index.js"
import dotenv from "dotenv"

dotenv.config({
    path:'./env'
})

connectDB()


/*
file execution start from index.js so one method to connect to DB is to write the connnection 
code into index file but this is not production standard  
better approach is to write code in db folder

import mongoose from "mongoose"
import express from "express"
import { DB_NAME } from "./constant"

const app = express()

;(async ()=>{
    try {
        
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  //this is the main line
        app.on("error", (error)=>{
            console.log("Error in connecting db",error)
            throw error
        })

        app.listen(process.end.PORT, ()=>{
                console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error in connecting DB: ",error)
        throw error        
    }

})()
*/
