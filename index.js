const  express = require("express");
const bodyParer = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const conectDB = require('./config/db');
const app= express() 

app.use(bodyParer.json())
app.use(cookieParser())
app.use(cors())

const userRoutes = require("./routes/user");


conectDB();

app.use("/api", userRoutes)

app.listen(process.env.PORT, console.log("Program is running on " + process.env.PORT))