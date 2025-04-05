import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database.js";
import User from "./models/user.js";

//Creating an express application - Server
const app = express();
const PORT = process.env.PORT;

// API - Signup
app.post("/signup", async (req, res) => {
  const reqBody = {
    firstName: "Suraj",
    lastName: "Mourya",
    email: "suraj@dmeo.com",
    password: "123123123",
    age: 24,
    gender: "Male",
  };

  const user = new User(reqBody);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    console.log("an error occured during creating a user");
    res.status(400).send("something went wrong");
  }
});

//Connnecting to database
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("An error occured during connecting to database");
  });
