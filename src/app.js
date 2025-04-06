import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database.js";
import User from "./models/user.js";

//Creating an express application - Server
const app = express();
const PORT = process.env.PORT;

app.use(express.json()) // This middleware is used to convert the incoming JSON request into javascript object.

// API - Signup
app.post("/signup", async (req, res) => {
  
  const user = new User(req.body)

  try {
    await user.save();
    res.json({
      message:"User Created Successfully",
      details:{
        email:req.body.email
      }
    });
  } catch (error) {
    console.log("an error occured during creating a user");
    res.status(400).send("something went wrong");
  }
});


// API - feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users);
  } catch (error) {
    console.log("an error occured during getting all users");
    res.status(400).send("something went wrong");
  }
});


//API - Get user by userId
app.get("/getUser",async(req,res)=>{
  const id = req.query.id
  try {
    const user = await User.findById({_id:id})
    if(!user){
      res.status(404).send("User not found")
      return
    }
    res.json(user)
  } catch (error) {
    console.log("error", error)
    res.status(400).send("something went wrong");
  }
})


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
