import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import userRouter from "./routes/user.js";
import requestRouter from "./routes/request.js";

//Creating an express application - Server
const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // This middleware is used to convert the incoming JSON request into javascript object.
app.use(cookieParser()); // This middleware is used to convert the cookie javascript object


app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/user', userRouter)
app.use('/request',requestRouter)


//Connnecting to database
connectDB()
  .then(async () => {
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("An error occured during connecting to database");
  });
