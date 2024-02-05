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


export { app };
