import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token is not present");

    const decodedData = jwt.verify(token, process.env.SECRETKEY);
    if (!decodedData) throw new Error("Token is invalid");

    const { userId } = decodedData;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User is not found");

    req.user = user;
    next();

  } catch (error) {
    console.log("Something went wrong : ", error);
    res.status(400).send("Something went wrong");
  }
};

export { userAuth };
