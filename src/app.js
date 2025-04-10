import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
import connectDB from "./config/database.js";
import User from "./models/user.js";
import { allowedSignUpFields, allowedUserFieldUpdate } from "./constants.js";
import {
  validateLoginData,
  validateSignUpData,
  validateUpdateProfileData,
} from "./utils/validation.js";

//Creating an express application - Server
const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // This middleware is used to convert the incoming JSON request into javascript object.

// API - Signup
app.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    //validate request body
    validateSignUpData(body);

    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      about,
      photoUrl,
    } = body;

    //Encrypt Passoword

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
      about,
      photoUrl,
    });

    await user.save();
    res.json({
      message: "User Created Successfully",
      details: {
        email: req.body.email,
      },
    });
  } catch (error) {
    console.log("an error occured during creating a user", error);
    if (error.code === 11000) {
      res.status(409).send("Email already exists");
      return;
    }
    res.status(400).send("something went wrong " + error);
  }
});

// API - login
app.post("/login", async (req, res) => {
  const body = req.body;
  try {
    validateLoginData(body);

    console.log("Hello");

    const { email, password } = body;

    // Check user exist in DB or not
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials");
    }

    res.send("Logged in successfully......");
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).send("Something went wrong " + error.message);
  }
});

// API - feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log("an error occured during getting all users");
    res.status(400).send("something went wrong");
  }
});

//API - Get user by userId
app.get("/getUser", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      throw new Error("Missing query params: id");
    }
    const user = await User.findById({ _id: id });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.json(user);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("something went wrong " + error.message);
  }
});

//API - Delete user by id
app.delete("/deleteUser", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) throw new Error("Missing query params");

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.send("User Deleted Successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("something went wrong " + error.message);
  }
});

//API - Update user by id
app.patch("/updateUser", async (req, res) => {
  try {
    validateUpdateProfileData(req);
    const userId = req.query.userId;
    const dataToUpdate = req.body;
    const user = await User.findByIdAndUpdate(userId, dataToUpdate, {
      returnOriginal: false,
    });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.json({
      message: "User updated successfully",
      updatedUser: user,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("something went wrong " + error.message);
  }
});

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
