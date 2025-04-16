import express from "express";
import { userAuth } from "../middlewares/auth.js";
import User from "../models/user.js";
import {
  validateResetPassword,
  validateUpdateProfileData,
} from "../utils/validation.js";
import bcrypt from "bcrypt";

const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("something went wrong " + error.message);
  }
});

profileRouter.patch("/edit/:userId", userAuth, async (req, res) => {
  try {
    validateUpdateProfileData(req);
    const userId = req.params.userId;
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

profileRouter.patch("/resetpassword", userAuth, async (req, res) => {
  try {
    validateResetPassword(req);
    const { _id, password } = req.user;
    const { newPassword, currentPassword } = req.body;
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      password
    );
    if (!isCurrentPasswordCorrect) {
      throw new Error("Current password is not valid");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(_id, { password: hashPassword });
    res.clearCookie("token").json({ message: "Your password is updated successfully. Please login again", id: _id });
  } catch (error) {
    console.log("Error: " + error);
    res.status(400).send("Something went wrong " + error.message);
  }
});

export default profileRouter;
