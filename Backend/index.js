//here we import all the required modules and start the server
//expreess for server creation
import express from "express"
//dotenv for environment variables
import dotenv from "dotenv"
//database connection function
import connectDB from "./config/db.js"
//importing auth routes
import authRouter from "./routes/AuthRoute.js"
//cookie parser to parse cookies from request headers
import cookieParser from "cookie-parser"

import cors from "cors"
//configure dotenv to access .env variables
dotenv.config()

import userRouter from "./routes/UserRoute.js"
import listRouter from "./routes/listRoute.js"
import bookRouter from "./routes/bookRoute.js"


let port= process.env.PORT || 6000
let app = express()



//middlewares


//use that for data in json format in req body
app.use(express.json())



//cookie parser middleware for parsing cookies from request headers. cookies are small pieces of data stored on the client side that are sent to the server with each request. They are commonly used for session management, user authentication, and storing user preferences.
app.use(cookieParser());

app.use(cors({
  origin:"http://localhost:5173",  
    credentials:true
}))




//routes for  User auth sign in,login, logout etc
//path compltete  http://localhost:8000/api/auth/signup
app.use("/api/auth",authRouter)


//routes for user which fech current user details
//path compltete  http://localhost:8000/api/auth/user
app.use("/api/user",userRouter)

//Listings Route thruogh which user add property
app.use("/api/listing",listRouter)

//booking route
app.use("/api/booking",bookRouter)




app.listen(port,()=>{
    connectDB()
    console.log("Server is running on ",port)
})



