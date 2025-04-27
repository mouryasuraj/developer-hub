import express from "express";
import { validateLoginData, validateSignUpData } from "../utils/validation.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  const body = req.body;
  try {
    validateLoginData(body);
    const { email, password } = body;
    console.log(email);
    

    // Check user exist in DB or not
    const user = await User.findOne({ email:email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    console.log(user);
    
    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials");
    }

    // Generate token
    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });

    res.send("Logged in successfully......");
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).send("Something went wrong " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token").send("Logged out successfully");
  } catch (error) {
    console.log("Error: " + error);
    res.status(400).send("Somehting went wrong " + error.message);
  }
});

export default authRouter;
