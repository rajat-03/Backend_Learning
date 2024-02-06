import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//data bahot jagha se aayega backend me to accept krne k liye ye main 4 configuration
//data accept krta hai express
app.use(express.json({ limit: "16kb" })); //16kb tk json data accept krega
//url se data lene k liye
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //extended optional hai
app.use(express.static("public")); //public folder se data lena ya save krne k liyee

//server se user ke cookies access kr paaye aur set kr paaye
app.use(cookieParser());

//routes import
//user.routes.js me export default use kiye isliye yaha router k jagha apna koi v naam de skte hain
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users", userRouter)

//url bnega: http://localhost:8000/api/v1/users/register

export { app };
