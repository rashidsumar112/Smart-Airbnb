//Auth Route file here we define the routes for authentication
import express from "express";
import { login, logOut, signUp } from "../controllers/AuthController.js";

const authRouter= express.Router();
//route for user signup 
authRouter.post("/signup",signUp)
//route for user login can be added here similarly
authRouter.post("/login",login)

//routes for logout
authRouter.post("/logout",logOut)

export default authRouter;