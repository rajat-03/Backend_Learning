import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from './app.js'

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, (req, res) => {
      console.log(`Server is running on Port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error!!", error);
  });
