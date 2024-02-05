import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, (req, res) => {
      res.send(`Server is running on Port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error!!", error);
  });
