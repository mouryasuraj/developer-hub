const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database.js");


//Creating an express application - Server
const app = express();
const PORT = process.env.PORT;


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
