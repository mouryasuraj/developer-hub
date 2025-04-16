import express from "express";
import User from "../models/user.js";
import { userAuth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log("an error occured during getting all users");
    res.status(400).send("something went wrong");
  }
});

userRouter.delete("/deleteUser/:userId", userAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) throw new Error("Missing params userId");

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

export default userRouter;
